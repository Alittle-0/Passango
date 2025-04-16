// src/pages/Create.jsx
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Create() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/audio/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setMessage(`File uploaded successfully: ${data.filePath}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section id="create" className="page active">
      <Header />
      <main>
        <section className="create-section">
          <div className="upload-box">
            <p>Place your file here</p>
            <p>It works with any audio source! A song on the radio, a live concert, or a jam with your friends.</p>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                id="audio-upload"
                accept="audio/mp3,audio/wav"
                onChange={handleFileChange}
                aria-label="Upload audio file"
              />
              <button type="submit" className="btn-upload">
                Upload
              </button>
            </form>
            {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
          </div>
        </section>
      </main>
      <Footer />
    </section>
  );
}

export default Create;