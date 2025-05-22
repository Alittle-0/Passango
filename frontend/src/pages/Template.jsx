// src/pages/Template.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function Template() {
  const [semiTones, setSemiTones] = useState(0);
  const location = useLocation();
  const [currentDetail, setCurrentDetail] = useState(
    location.state || {
      lyrics: "",
      song: "",
      artist: "",
      chords: [],
      tempo: 0,
      key: "",
      audio: null,
      mimetype: "",
    }
  );
  const currentAudio = useRef();
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [totalLength, setTotalLength] = useState("00 : 00");
  const [currentTime, setCurrentTime] = useState("00 : 00");
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  const [previousChord, setPreviousChord] = useState(null);
  const [nextChord, setNextChord] = useState(null);

  useEffect(() => {
    // Convert Base64 audio to Blob and create URL
    if (currentDetail.audio) {
      try {
        // Remove the Base64 prefix if present (e.g., "data:audio/mpeg;base64,")
        const base64String = currentDetail.audio.startsWith("data:")
          ? currentDetail.audio.split(",")[1]
          : currentDetail.audio;

        // Convert Base64 to binary
        const binary = atob(base64String);
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
        }

        // Create Blob and URL
        const blob = new Blob([view], {
          type: currentDetail.mimetype || "audio/mpeg",
        });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Cleanup on unmount
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error("Error converting Base64 to audio:", error);
      }
    }
  }, [currentDetail.audio, currentDetail.mimetype]);

  const chordListRef = useRef(null);

  useEffect(() => {
    if (currentChordIndex >= 0 && chordListRef.current) {
      const activeChord = chordListRef.current.querySelector(".active");
      if (activeChord) {
        activeChord.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentChordIndex]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")} : ${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr
      .split(":")
      .map((num) => parseInt(num.trim()));
    return minutes * 60 + seconds;
  };

  // Enhanced audio event handlers
  const handleAudioPlay = async () => {
    try {
      if (!currentAudio.current) return;

      if (currentAudio.current.paused) {
        await currentAudio.current.play();
        setIsAudioPlaying(true);
      } else {
        currentAudio.current.pause();
        setIsAudioPlaying(false);
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
      setCurrentTime("00 : 00");
      await currentAudio.current.play();
      setIsAudioPlaying(true);
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
      currentAudio.current.currentTime =
        (value * currentAudio.current.duration) / 100;
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

      // Update current chord
      if (currentDetail.chords) {
        const newChordIndex = currentDetail.chords.findIndex((chord) => {
          const startTime = timeToSeconds(chord.start_time);
          const endTime = timeToSeconds(chord.end_time);
          return currentTime >= startTime && currentTime < endTime;
        });

        if (newChordIndex !== currentChordIndex) {
          // Set previous chord
          if (currentChordIndex >= 0) {
            setPreviousChord(currentDetail.chords[currentChordIndex]);
          }

          // Set current chord
          setCurrentChordIndex(newChordIndex);

          // Set next chord
          if (
            newChordIndex >= 0 &&
            newChordIndex < currentDetail.chords.length - 1
          ) {
            setNextChord(currentDetail.chords[newChordIndex + 1]);
          } else {
            setNextChord(null);
          }
        }
      }
    } catch (error) {
      console.error("Error updating audio time:", error);
    }
  };

  if (!currentDetail.lyrics) {
    return <div>No lyrics found. Please go back and try again.</div>;
  }
  // Handle semitones change
   const handleSemitonesChange = (e) => {
    if (semiTones>=10||semiTones<=-10){
      if (e.target.value === "+"&& semiTones===-10) {
        setSemiTones(-9);
      }
      else if (e.target.value === "-"&& semiTones===10) {
        setSemiTones(9);
      }
      else{alert("Please select a value between -10 and 10");}

      return;
    }
    if (e.target.value === "+") {
      setSemiTones((prev) => parseInt(prev) + 1);
    }
    if (e.target.value === "-") {
      setSemiTones((prev) => parseInt(prev) - 1);
    }
  };

  return (
    <div className="lyric-style">
      <div className="main-container">
        <div className="chord-section">
          <div className="chord-display">
            <div className="chord-info">
              <h2>Key: {currentDetail.key}</h2>
              <div className="tempo-info">
                <button value='-' onClick={handleSemitonesChange}>-</button>
                {semiTones}
                <button value='+' onClick={handleSemitonesChange}>+</button>
              </div>
            </div>
            <div className="chord-progression">
              {/* Previous Chord */}
              <div className="chord-slot previous">
                {previousChord && (
                  <div className="chord-content">
                    <div className="chord-name">{previousChord.chord}</div>
                  </div>
                )}
              </div>

              {/* Current Chord */}
              <div className="chord-slot current">
                {currentChordIndex >= 0 && currentDetail.chords && (
                  <div className="chord-content">
                    <div className="chord-name">
                      {currentDetail.chords[currentChordIndex].chord}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Chord */}
              <div className="chord-slot next">
                {nextChord && (
                  <div className="chord-content">
                    <div className="chord-name">{nextChord.chord}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="playback-section">
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
              value={audioProgress}
              onChange={handleMusicProgressBar}
            />
          </div>
        </div>

        <section className="lyrics-container">
          <audio
            src={audioUrl}
            ref={currentAudio}
            preload="auto"
            onEnded={handleReplay}
            onTimeUpdate={handleAudioUpdate}
          ></audio>
          <div className="lyric-script">
            <h1>
              {currentDetail.song} by {currentDetail.artist}
            </h1>
            <p>{currentDetail.lyrics}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Template;
