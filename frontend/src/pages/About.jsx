// src/pages/Homepage.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Featured from '../components/Featured';

function About() {
  const photos = [
    '/images/music slogan.jpg',
    '/images/mrchau.jpg',
    '/images/music slogan.jpg',
    '/images/music slogan.jpg',
    '/images/music slogan.jpg',
  ];
  return (
    <section>
      <Header/>
      <main className='homepage'>
        <Hero
          buttonLink="/login"
          imageSrc="public/images/music slogan.jpg"
        />
        <section className="about">
        <div className="pictures">
            {photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Team member ${index + 1}`}
                className={`face face-${index + 1}`}
              />
            ))}
          </div>
          <div className='about_content'>
          <h2>About us</h2>
          <p>
            Embark on a melodic journey with PassanGo, where music transcends boundaries and emotions. Our harmonious tunes are crafted by a talented team of 5 members. Together, we blend creativity and passion to deliver soul-stirring tracks that resonate with your heart. Dive into the world of PassanGo and let the music speak to your soul.
          </p>
          </div>
        </section>
        <Featured onDiscoverClick={() => window.location.href = '/login'} />
        
      </main>
      <Footer />
    </section>
  );
}

export default About;