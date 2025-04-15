// src/pages/GetStarted.jsx
import { useNavigate } from 'react-router-dom';

function GetStarted() {
  const navigate = useNavigate();

  return (
    <section id="get-started">
      <div className="get-started-content">
        <h1>PassanGo</h1>
        <p>
          Welcome to PassanGo, your ultimate music companion! With our cutting-edge technology, PassanGo accurately detects any chords and tabs with remarkable precision, empowering musicians of all levels to play their favorite songs effortlessly. Whether you’re a beginner seeking to learn new tunes or an experienced player aiming to refine your skills, PassanGo transforms the way you connect with music. Dive in and let us elevate your musical journey—your next jam session awaits!
        </p>
        <button onClick={() => navigate('/about')} aria-label="Get started with PassanGo">
          GET STARTED
        </button>
      </div>
    </section>
  );
}

export default GetStarted;