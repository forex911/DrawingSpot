# DrawingSpot — Backend

Spring Boot REST API for the DrawingSpot platform.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Language     | Java 21                           |
| Framework    | Spring Boot 3.5                   |
| Security     | Spring Security + JWT (jjwt 0.11) |
| Database     | PostgreSQL                        |
| ORM          | Spring Data JPA / Hibernate       |
| Build Tool   | Maven                             |
| Utilities    | Lombok                            |

---

## Prerequisites

- Java 21+
- Maven 3.9+ (or use the included `mvnw` wrapper)
- PostgreSQL 14+

---

## Setup

### 1. Create the database

```sql
CREATE DATABASE drawingspot;
```

### 2. Configure application properties

Copy the example config and fill in your values:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Open `application.properties` and set:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/drawingspot
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

jwt.secret=your_long_random_secret_at_least_32_chars
jwt.expiration=3600000
```

> `application.properties` is gitignored. Never commit real credentials.

### 3. Run the server

```bash
# Using the Maven wrapper
./mvnw spring-boot:run          # macOS / Linux
.\mvnw.cmd spring-boot:run      # Windows

# Or with Maven installed globally
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

## Project Structure

```
src/main/java/com/example/drawingspot/
├── config/         # Security, CORS, and MVC configuration
├── controller/     # REST API endpoints
├── exception/      # Global exception handling
├── model/          # JPA entities
├── repository/     # Spring Data repositories
├── service/        # Business logic interfaces and implementations
└── util/           # JWT utilities
```

---

## API Overview

| Module      | Base Path         |
|-------------|-------------------|
| Auth        | `/api/auth`       |
| Orders      | `/api/orders`     |
| Gallery     | `/api/gallery`    |
| Pricing     | `/api/pricing`    |
| Chat        | `/api/chat`       |
| Feedback    | `/api/feedback`   |
| Newsletter  | `/api/newsletter` |

Refer to the root `README.md` for the full endpoint reference.

---

## Configuration Reference

| Property                          | Description                        | Default              |
|-----------------------------------|------------------------------------|----------------------|
| `server.port`                     | Port the server runs on            | `8080`               |
| `spring.datasource.url`           | PostgreSQL JDBC connection URL     | —                    |
| `spring.datasource.username`      | Database username                  | —                    |
| `spring.datasource.password`      | Database password                  | —                    |
| `jwt.secret`                      | Secret key for signing JWT tokens  | —                    |
| `jwt.expiration`                  | Token expiry in milliseconds       | `3600000` (1 hour)   |
| `upload.dir`                      | Directory for uploaded images      | `uploads/orders`     |
| `spring.servlet.multipart.max-file-size` | Max upload file size        | `20MB`               |

---

## Resetting the Database

To drop all tables and start fresh during development:

```bash
psql -U postgres -d drawingspot -f reset.sql
```

Hibernate will recreate the schema automatically on next startup.

---

## Notes

- File uploads are stored locally under `uploads/orders/`. This directory is auto-created on first upload.
- The `target/` directory is gitignored. Run `mvn clean` to remove build artifacts.
- All API endpoints are currently open (no route-level auth enforcement). Secure endpoints as needed before production deployment.
