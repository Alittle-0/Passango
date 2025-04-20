import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Template() {
  const location = useLocation();
  const { lyrics, song, artist } = location.state || {};

  useEffect(() => {
    if (!lyrics) return;

    // ParagraphAnimator class from basic.html
    class ParagraphAnimator {
      constructor(paragraph, index) {
        this.paragraph = paragraph;
        this.container = document.createElement('div');
        this.container.className = 'paragraph-container';
        this.container.id = `paragraph-${index}`;
        this.paragraph.parentNode.replaceChild(this.container, this.paragraph);
        this.sentences = this.splitSentences(paragraph.textContent);
        this.currentIndex = 0;
        this.sentenceElements = [];
        this.baseInterval = 2000;
        this.baseTransition = 700;
        this.tempo = 1.0;
        this.averageLength = 30;
        this.init();
      }

      splitSentences(text) {
        return text
          .split('\n')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }

      calculateInterval(sentence) {
        const lengthFactor = sentence.length / this.averageLength;
        const interval = Math.max(1000, this.baseInterval * lengthFactor * this.tempo);
        return interval;
      }

      calculateTransitionDuration(interval) {
        const duration = this.baseTransition * (interval / this.baseInterval);
        return duration.toFixed(2);
      }

      init() {
        this.sentences.forEach((sentence, i) => {
          const div = document.createElement('div');
          div.textContent = sentence;
          div.className = 'sentence hidden';
          this.container.appendChild(div);
          this.sentenceElements.push(div);
        });
        this.updateDisplay();
      }

      updateDisplay() {
        const currentSentence = this.sentences[this.currentIndex] || '';
        const interval = this.calculateInterval(currentSentence);
        const transitionDuration = this.calculateTransitionDuration(interval);

        this.sentenceElements.forEach((div) => {
          div.style.setProperty('--transition-duration', `${transitionDuration}ms`);
        });

        this.sentenceElements.forEach((div, i) => {
          div.className = 'sentence hidden';
          if (i === this.currentIndex - 2) {
            div.className = 'sentence exiting';
          } else if (i === this.currentIndex - 1) {
            div.className = 'sentence previous';
          } else if (i === this.currentIndex) {
            div.className = 'sentence current';
          } else if (i === this.currentIndex + 1) {
            div.className = 'sentence next start';
            void div.offsetWidth;
            div.className = 'sentence next';
          }
        });

        clearTimeout(this.nextTimeout);
        this.nextTimeout = setTimeout(() => {
          if (this.currentIndex < this.sentences.length - 1) {
            this.currentIndex++;
            this.updateDisplay();
          }
        }, interval);
      }
    }

    // Initialize animation
    const lyricContainer = document.querySelector('.lyric-script p');
    if (lyricContainer && lyrics) {
        lyricContainer.textContent = lyrics;
      new ParagraphAnimator(lyricContainer, 0);
    }

    return () => {
      clearTimeout(window.nextTimeout);
    };
  }, [lyrics]);

  if (!lyrics) {
    return <div>No lyrics found. Please go back and try again.</div>;
  }

  return (
    <div>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            overflow-x: hidden;
          }

          .paragraph-container {
            position: relative;
            margin-bottom: 60px;
            height: 100px;
            width: 100%;
            overflow: visible;
          }

          .sentence {
            display: block;
            position: absolute;
            width: 30%;
            text-align: center;
            white-space: normal;
            transition: all var(--transition-duration, 0.7s) cubic-bezier(0.4, 0, 0.2, 1);
          }

          .sentence.exiting {
            left: 0;
            transform: translateX(-150%);
            opacity: 0;
          }

          .sentence.previous {
            left: 0;
            transform: translateX(0);
            opacity: 0.5;
          }

          .sentence.current {
            left: 50%;
            transform: translateX(-50%);
            opacity: 1;
          }

          .sentence.next {
            left: 80%;
            transform: translateX(-50%);
            opacity: 0.5;
          }

          .sentence.next.start {
            left: 120%;
            transform: translateX(0);
            opacity: 0;
          }

          .sentence.hidden {
            display: none;
          }
        `}
      </style>
      <section className="lyrics-container">
        <div className="lyric-script">
          <h1>{song} by {artist}</h1>
          <p>{lyrics}</p>
        </div>
      </section>
    </div>
  );
};

export default Template;