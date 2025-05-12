// src/pages/Template.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function Template() {
  const location = useLocation();
  const { lyrics, song, artist, chords, tempo, key } = location.state || {};
  const [progress, setProgress] = useState(0); // Track progress for the slider
  const [isPaused, setIsPaused] = useState(false); // Track paused state for UI
  const animatorRef = useRef(null); // Store the ParagraphAnimator instance

  useEffect(() => {
    if (!lyrics) return;

    class ParagraphAnimator {
      constructor(paragraph, index, setProgressCallback) {
        this.paragraph = paragraph;
        this.container = document.createElement("div");
        this.container.className = "paragraph-container";
        this.container.id = `paragraph-${index}`;
        this.paragraph.parentNode.replaceChild(this.container, this.paragraph);
        this.sentences = this.splitSentences(paragraph.textContent);
        this.currentIndex = 0;
        this.sentenceElements = [];
        this.baseInterval = 2000;
        this.baseTransition = 700;
        this.tempo = 1.0//set by the time of chord(tempo)
        this.averageLength = 30;
        this.setProgressCallback = setProgressCallback; // Callback to update progress
        this.isPaused = false; // Track paused state
        this.init();
      }

      splitSentences(text) {
        return text
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }

      calculateInterval(sentence) {
        const lengthFactor = sentence.length / this.averageLength;
        const interval = Math.max(
          1000,
          this.baseInterval * lengthFactor * this.tempo
        );
        return interval;
      }

      calculateTransitionDuration(interval) {
        const duration = this.baseTransition * (interval / this.baseInterval);
        return duration.toFixed(2);
      }

      init() {
        this.sentences.forEach((sentence, i) => {
          const div = document.createElement("div");
          div.textContent = sentence;
          div.className = "sentence hidden";
          this.container.appendChild(div);
          this.sentenceElements.push(div);
        });
        this.updateDisplay();
      }

      updateDisplay() {
        if (this.isPaused) return;

        const currentSentence = this.sentences[this.currentIndex] || "";
        const interval = this.calculateInterval(currentSentence);
        const transitionDuration = this.calculateTransitionDuration(interval);

        this.sentenceElements.forEach((div) => {
          div.style.setProperty(
            "--transition-duration",
            `${transitionDuration}ms`
          );
        });

        this.sentenceElements.forEach((div, i) => {
          div.className = "sentence hidden";
          if (i === this.currentIndex - 2) {
            div.className = "sentence exiting";
          } else if (i === this.currentIndex - 1) {
            div.className = "sentence previous";
          } else if (i === this.currentIndex) {
            div.className = "sentence current";
          } else if (i === this.currentIndex + 1) {
            div.className = "sentence next start";
            void div.offsetWidth;
            div.className = "sentence next";
          }
        });

        // Update progress for the slider
        const progressPercentage =
          (this.currentIndex / (this.sentences.length - 1)) * 100;
        this.setProgressCallback(progressPercentage);

        clearTimeout(this.nextTimeout);
        this.nextTimeout = setTimeout(() => {
          if (this.currentIndex < this.sentences.length - 1) {
            this.currentIndex++;
            this.updateDisplay();
          } else {
            this.setProgressCallback(100); // Ensure progress reaches 100% at the end
          }
        }, interval);
      }

      // Replay the animation from the beginning
      replay() {
        this.currentIndex = 0;
        this.isPaused = false;
        this.updateDisplay();
      }

      // Seek to a specific point in the animation based on progress (0 to 100)
      seek(progress) {
        this.isPaused = false;
        const targetIndex = Math.round(
          (progress / 100) * (this.sentences.length - 1)
        );
        this.currentIndex = Math.min(
          Math.max(targetIndex, 0),
          this.sentences.length - 1
        );
        this.updateDisplay();
      }

      // Pause the animation
      pause() {
        this.isPaused = true;
        clearTimeout(this.nextTimeout);
      }

      // Resume the animation
      resume() {
        if (this.isPaused) {
          this.isPaused = false;
          this.updateDisplay();
        }
      }
    }

    // Initialize animation
    const lyricContainer = document.querySelector(".lyric-script p");
    if (lyricContainer && lyrics) {
      lyricContainer.textContent = lyrics;
      animatorRef.current = new ParagraphAnimator(
        lyricContainer,
        0,
        setProgress
      );
    }

    return () => {
      clearTimeout(window.nextTimeout);
    };
  }, [lyrics]);

  // Handle replay button click
  const handleReplay = () => {
    if (animatorRef.current) {
      animatorRef.current.replay();
      setIsPaused(false);
    }
  };

  // Handle pause button click
  const handlePause = () => {
    if (animatorRef.current) {
      animatorRef.current.pause();
      setIsPaused(true);
    }
  };

  // Handle continue button click
  const handleContinue = () => {
    if (animatorRef.current) {
      animatorRef.current.resume();
      setIsPaused(false);
    }
  };

  // Handle progress slider change
  const handleProgressChange = (e) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    if (animatorRef.current) {
      animatorRef.current.seek(newProgress);
      setIsPaused(false); // Resume animation when seeking
    }
  };

  if (!lyrics) {
    return <div>No lyrics found. Please go back and try again.</div>;
  }

  return (
    <div className="lyric-style">
      <section className="lyrics-container">
        <div className="lyric-script">
          <h1>
            {song} by {artist}
          </h1>
          <p>{lyrics}</p>
          {/* Playback controls moved inside .lyric-script */}
          <div className="playback-controls">
            <button onClick={handleReplay} className="replay-btn">
              Replay
            </button>
            <button
              onClick={handlePause}
              className="pause-btn"
              disabled={isPaused}
            >
              Pause
            </button>
            <button
              onClick={handleContinue}
              className="continue-btn"
              disabled={!isPaused}
            >
              Continue
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="progress-slider"
          />
        </div>
      </section>
      <div className="Chord">
        <p>Chord is supposed to be here</p>
        <br/>
        <ul>
          {chords.map((chord, index) => (
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