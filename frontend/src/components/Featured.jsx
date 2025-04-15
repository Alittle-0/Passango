// src/components/Featured.jsx
function Featured({ onDiscoverClick }) {
  return (
    <section className="featured">
      <h2>Featured</h2>
      <div className="feature-item">
        <p>Our chord and tab detection is 100% precise</p>
        <button href="#" onClick={onDiscoverClick}>Discover now</button>
      </div>
      <div className="feature-cards">
        <div className="card">
          <img src="public/images/music.png" alt="Waveform and vinyl record icon" />
          <button onClick={onDiscoverClick} aria-label="Chord detection">Chord detection</button>
        </div>
        <div className="card">
          <img src="public/images/music 2.png" alt="Headphones with waveform icon" />
          <button onClick={onDiscoverClick} aria-label="Tab detection" >Tab detection</button>
        </div>
      </div>
    </section>
  );
}

export default Featured;