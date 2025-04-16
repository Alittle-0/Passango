// src/components/Hero.jsx
function Hero({ title, description, buttonText, buttonLink, imageSrc }) {
  return (
    <section className="hero">
      <div className="hero-text">
        <h2>Discover Your Soul</h2>
        <p>PassanGo welcomes you to a world of musical creativity. Explore, create, and enhance your music with our innovative chord and tab detection platform.</p>
      </div>
      <div className="hero-image">
        <img src={imageSrc} alt="Hero image" />
      </div>
    </section>
  );
}

export default Hero;