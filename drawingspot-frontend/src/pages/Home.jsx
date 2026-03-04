import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedCarousels from "../components/home/FeaturedCarousel";
import About from "../components/home/About";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";
import MarqueeBand from "../components/home/MarqueeBand";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MarqueeBand />
      <CategoryGrid />
      <FeaturedCarousels />
      <About />
      <Testimonials />
      <WhyChooseUs />
      <Footer />
    </>
  );
}

export default Home;
