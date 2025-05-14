// src/pages/Template.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ParagraphAnimator from "../../public/javascript/Template_animator";

function Template() {
  const location = useLocation();
  const [currentDetail, setCurrentDetail] = useState(
    location.state || {
      lyrics: "",
      song: "",
      artist: "",
      chords: [],
      tempo: 120, // Default tempo
      key: "",
      audio: null,
    }
  );
  const currentAudio = useRef();
  const animatorRef = useRef(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [totalLength, setTotalLength] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");

  // Initialize the animator
  useEffect(() => {
    if (!currentDetail.lyrics) return;
    const lyricContainer = document.querySelector(".lyric");
    if (lyricContainer && currentDetail.lyrics) {
      lyricContainer.textContent = currentDetail.lyrics;
      animatorRef.current = new ParagraphAnimator(
        lyricContainer,
        0,
        currentDetail.tempo || 120
      );
      if (isAudioPlaying) {
        animatorRef.current.start();
      }
    }

    return () => {
      if (animatorRef.current) {
        animatorRef.current.cleanup();
      }
    };
  }, [currentDetail.lyrics, currentDetail.tempo, isAudioPlaying]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAudioPlay = async () => {
    try {
      if (!currentAudio.current) return;

      if (currentAudio.current.paused) {
        await currentAudio.current.play();
        setIsAudioPlaying(true);
        animatorRef.current?.start();
      } else {
        currentAudio.current.pause();
        setIsAudioPlaying(false);
        animatorRef.current?.stop();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleReplay = async () => {
    try {
      if (!currentAudio.current) return;

      currentAudio.current.currentTime = 0;
      setAudioProgress(0);
      setCurrentTime("00:00");
      await currentAudio.current.play();
      setIsAudioPlaying(true);
      animatorRef.current?.start();
    } catch (error) {
      console.error("Error replaying audio:", error);
      setIsAudioPlaying(false);
    }
  };

  const handleMusicProgressBar = (e) => {
    try {
      if (!currentAudio.current) return;

      const value = parseFloat(e.target.value);
      if (isNaN(value)) return;

      setAudioProgress(value);
      const newTime = (value * currentAudio.current.duration) / 100;
      currentAudio.current.currentTime = newTime;
      animatorRef.current?.update(newTime, currentAudio.current.duration);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleAudioUpdate = () => {
    try {
      if (!currentAudio.current) return;

      const { currentTime, duration } = currentAudio.current;
      setTotalLength(formatTime(duration));
      setCurrentTime(formatTime(currentTime));

      const progress = (currentTime / duration) * 100;
      setAudioProgress(isNaN(progress) ? 0 : progress);
      animatorRef.current?.update(currentTime, duration);
    } catch (error) {
      console.error("Error updating audio time:", error);
    }
  };

  if (!currentDetail.lyrics) {
    return <div>No lyrics found. Please go back and try again.</div>;
  }

  return (
    <div className="lyric-style">
      <section className="lyrics-container">
        <audio
          src={currentDetail.audio}
          ref={currentAudio}
          preload="auto"
          onEnded={handleReplay}
          onTimeUpdate={handleAudioUpdate}
          onLoadedMetadata={() => {
            if (currentAudio.current) {
              setTotalLength(formatTime(currentAudio.current.duration));
              animatorRef.current?.update(0, currentAudio.current.duration);
            }
          }}
        ></audio>
        <div className="lyric-script">
          <h1>
            {currentDetail.song} by {currentDetail.artist}
          </h1>
          <p className="lyric paragraph-container"></p>
          <div className="playback-controls">
            <button onClick={handleReplay} className="replay-btn">
              Replay
            </button>
            <button onClick={handleAudioPlay} className="continue-btn">
              {isAudioPlaying ? "Pause" : "Play"}
            </button>
          </div>
          <div className="musicTimer">
            <p className="currentTime">{currentTime}</p>
            <p className="totalTime">{totalLength}</p>
          </div>
          <input
            type="range"
            name="musicProgressBar"
            className="musicProgressBar"
            min="0"
            max="100"
            value={audioProgress}
            onChange={handleMusicProgressBar}
          />
        </div>
      </section>
      <div className="Chord">
        <ul>
          <p>Key: {currentDetail.key}</p>
          <br />
          {currentDetail.chords &&
            currentDetail.chords.map((chord, index) => (
              <li key={index}>
                {chord.start_time} - {chord.end_time}: {chord.chord}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Template;