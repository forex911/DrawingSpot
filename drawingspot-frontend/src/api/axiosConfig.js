import axios from "axios";

/*
  Centralized Axios configuration
  This connects React frontend to Spring Boot backend
*/

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  Automatically attach JWT token
  (Will work once login returns token)
*/
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // When uploading files (FormData), let the browser/axios set
    // the Content-Type automatically with the correct multipart boundary.
    // The default 'application/json' header would break multipart parsing.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
  Optional: Handle global response errors
*/
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;