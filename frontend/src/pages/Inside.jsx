// src/pages/Inside.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Featured from '../components/Featured';


function Inside() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, []);
  // Add the tilt effect useEffect here
  useEffect(() => {
    const section = document.querySelector('.Reason-of-creation section');
    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const maxTilt = 15;
      const tiltX = (mouseY / (rect.height / 2)) * maxTilt;
      const tiltY = -(mouseX / (rect.width / 2)) * maxTilt;

      section.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const handleMouseLeave = () => {
      section.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup event listeners on component unmount
    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="inside" className="page active">
      <Header />
      <main>
        {user && <p>Welcome, {user.email}!</p>}
        <div className='top_inside'>
          <div className='quote_inside'>
            <h2>Welcome to PassanGo: Your Ultimate Music Companion</h2>
            <p>Discover PassanGo, the music app that brings songs to life for musicians and enthusiasts alike. With powerful chord recognition, lyrics detection, and a simple, intuitive design, we make it easy to analyze, learn, and create music. Upload a song, uncover its chords and lyrics in real-time, and explore your creativity—all in one place. Powered by cutting-edge technology and a passion for music, PassanGo is here to inspire your musical journey.</p>
          </div>
          <div className='img_inside'> 
              <img src='public/images/radio.jpg' alt="RANDOM stuffs" />
          </div>
        </div>
        <div className='Reason-of-creation'>
            <h2>Why We Created PassanGo</h2>
            <section>We developed PassanGo to help beginner and intermediate musicians overcome the challenges they face when using existing music apps. Many apps, like Hợp âm chuẩn in Vietnam or global ones like MuseScore, are great but often lack support for newcomers. For example, they only provide chords for songs uploaded by creators, leaving out original or unlisted tracks—like a song your friend wrote. Additionally, professional music sheets with complex notes and theory can be overwhelming for those without extensive knowledge, forcing them to spend hours searching for tutorials on platforms like YouTube. PassanGo solves this by offering a simple, free app that generates chords and tabs from any audio file you upload, with an easy-to-use interface and guides to help beginners learn and play their favorite songs without needing advanced skills or external resources.</section>
        </div>
        <Featured onDiscoverClick={() => window.location.href = '/create'} />
      </main>
      <Footer />
    </section>
  );
}

export default Inside;