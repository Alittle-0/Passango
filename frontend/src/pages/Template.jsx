import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ParagraphAnimator from "../function/Template_animation"; // Adjust the import path as necessary
import debounce from "lodash/debounce";

const TimeMarkers = ({ totalDuration, numMarkers = 10 }) => {
  const markers = [];
  for (let i = 0; i <= numMarkers; i++) {
    const time = (i / numMarkers) * totalDuration;
    const position = (i / numMarkers) * 100;
    markers.push(
      <div
        key={i}
        className="absolute transform -translate-x-1/2 flex flex-col items-center"
        style={{ left: `${position}%`, bottom: "-24px" }}
      >
        <div className="h-2 w-px bg-gray-300"></div>
        <span className="text-xs text-gray-500 mt-1">
          {`${Math.floor(time / 60)}:${Math.floor(time % 60)
            .toString()
            .padStart(2, "0")}`}
        </span>
      </div>
    );
  }
  return <div className="absolute w-full h-6">{markers}</div>;
};

function Template() {
  const location = useLocation();
  const { lyrics, song, artist, chords, key } = location.state || {};
  const [currentChord, setCurrentChord] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [adjustedCurrentTime, setAdjustedCurrentTime] = useState(0);
  const [adjustedTotalTime, setAdjustedTotalTime] = useState(0);
  const animatorRef = useRef(null);

  // Calculate total duration from chords
  const totalDuration = useMemo(() => {
    if (!chords || chords.length === 0) return 0;
    return parseFloat(chords[chords.length - 1].end_time);
  }, [chords]);

  // Calculate current time based on progress
  const currentTime = useMemo(() => {
    return (progress / 100) * totalDuration;
  }, [progress, totalDuration]);

  // Adjust displayed times every 4 seconds
  useEffect(() => {
    // Reset adjusted times when progress is 0 (e.g., on replay)
    if (progress === 0) {
      setAdjustedCurrentTime(0);
      setAdjustedTotalTime(totalDuration);
      return;
    }

    // Calculate the number of 4-second intervals passed
    const interval = 4; // 4 seconds
    const intervalsPassed = Math.floor(currentTime / interval);

    // Adjust times: add 4s to current time, subtract 4s from total time per interval
    const timeAdjustment = intervalsPassed * interval;
    const newAdjustedCurrentTime = Math.min(
      currentTime + timeAdjustment,
      totalDuration
    );
    const newAdjustedTotalTime = Math.max(totalDuration - timeAdjustment, 0);

    setAdjustedCurrentTime(newAdjustedCurrentTime);
    setAdjustedTotalTime(newAdjustedTotalTime);
  }, [currentTime, totalDuration, progress]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Memoized chord lookup function
  const getCurrentChord = useCallback(
    (progressValue) => {
      if (!chords || chords.length === 0) return null;
      const currentTime = (progressValue / 100) * totalDuration;
      return chords.find(
        (chord) =>
          currentTime >= parseFloat(chord.start_time) &&
          currentTime <= parseFloat(chord.end_time)
      );
    },
    [chords, totalDuration]
  );

  // Debounced progress handler
  const handleProgressChange = useMemo(
    () =>
      debounce((e) => {
        const newProgress = Number(e.target.value);
        setProgress(newProgress);
        setCurrentChord(getCurrentChord(newProgress));
        if (animatorRef.current) {
          animatorRef.current.seek(newProgress);
          setIsPaused(false);
        }
      }, 100),
    [getCurrentChord]
  );

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      handleProgressChange.cancel();
    };
  }, [handleProgressChange]);

  // Handle playback controls
  const handleReplay = useCallback(() => {
    if (animatorRef.current) {
      animatorRef.current.replay();
      setProgress(0); // Reset progress to trigger time reset
      setIsPaused(false);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (animatorRef.current) {
      animatorRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const handleContinue = useCallback(() => {
    if (animatorRef.current) {
      animatorRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  // Initialize animator
  useEffect(() => {
    if (!lyrics) return;

    const lyricContainer = document.querySelector(".lyric-script p");
    if (lyricContainer && lyrics) {
      lyricContainer.textContent = lyrics;
      animatorRef.current = new ParagraphAnimator(
        lyricContainer,
        0,
        setProgress,
        setCurrentChord,
        getCurrentChord
      );
    }

    return () => {
      if (animatorRef.current) {
        animatorRef.current.cleanup();
      }
    };
  }, [lyrics, getCurrentChord]);

  if (!lyrics) {
    return (
      <div role="alert" className="text-red-500">
        No lyrics found. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="lyric-style mx-auto max-w-4xl p-4">
      <section className="lyrics-container">
        <div className="lyric-script">
          <h1 className="text-2xl font-bold mb-4">
            {song} by {artist}
          </h1>
          <p className="mb-4">{lyrics}</p>
          <div className="playback-controls flex gap-2 mb-4">
            <button
              onClick={handleReplay}
              className="replay-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              aria-label="Replay song"
            >
              Replay
            </button>
            <button
              onClick={handlePause}
              className="pause-btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={isPaused}
              aria-label="Pause song"
            >
              Pause
            </button>
            <button
              onClick={handleContinue}
              className="continue-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={!isPaused}
              aria-label="Resume song"
            >
              Continue
            </button>
          </div>
          <div className="progress-container flex items-center gap-4 mb-12">
            {" "}
            {/* Increased bottom margin */}
            <span
              className="current-time min-w-[50px] text-right"
              aria-label="Current time"
            >
              {formatTime(adjustedCurrentTime)}
            </span>
            <div className="relative flex-grow">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="progress-slider w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                aria-label="Song progress slider"
              />
              <div className="relative w-full">
                <TimeMarkers totalDuration={totalDuration} />
              </div>
            </div>
            <span
              className="total-time min-w-[50px]"
              aria-label="Total duration"
            >
              {formatTime(adjustedTotalTime)}
            </span>
          </div>
        </div>
      </section>
      <div className="Chord mt-4">
        <p className="font-semibold">Key: {key}</p>
        <ul className="mt-2">
          {chords?.map((chord, index) => (
            <li
              key={index}
              className={`py-1 ${
                currentChord && currentChord.start_time === chord.start_time
                  ? "font-bold text-blue-600"
                  : ""
              }`}
            >
              {chord.start_time} - {chord.end_time}: {chord.chord}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Template.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      lyrics: PropTypes.string,
      song: PropTypes.string,
      artist: PropTypes.string,
      chords: PropTypes.arrayOf(
        PropTypes.shape({
          start_time: PropTypes.string,
          end_time: PropTypes.string,
          chord: PropTypes.string,
        })
      ),
      key: PropTypes.string,
    }),
  }),
};

export default Template;
