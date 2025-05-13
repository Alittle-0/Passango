export default class ParagraphAnimator {
    constructor(paragraph, index, setProgressCallback, setChordCallback, getChordCallback) {
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
      this.tempo = 1.0;
      this.averageLength = 30;
      this.setProgressCallback = setProgressCallback;
      this.setChordCallback = setChordCallback;
      this.getChordCallback = getChordCallback;
      this.isPaused = false;
      this.nextTimeout = null;
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
      return Math.max(1000, this.baseInterval * lengthFactor * this.tempo);
    }
  
    calculateTransitionDuration(interval) {
      return (this.baseTransition * (interval / this.baseInterval)).toFixed(2);
    }
  
    init() {
      this.sentences.forEach((sentence) => {
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
        div.style.setProperty("--transition-duration", `${transitionDuration}ms`);
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
  
      const progressPercentage =
        (this.currentIndex / (this.sentences.length - 1)) * 100;
      this.setProgressCallback(progressPercentage);
  
      const currentChord = this.getChordCallback(progressPercentage);
      this.setChordCallback(currentChord);
  
      clearTimeout(this.nextTimeout);
      this.nextTimeout = setTimeout(() => {
        if (this.currentIndex < this.sentences.length - 1) {
          this.currentIndex++;
          this.updateDisplay();
        } else {
          this.setProgressCallback(100);
        }
      }, interval);
    }
  
    replay() {
      this.currentIndex = 0;
      this.isPaused = false;
      this.updateDisplay();
    }
  
    seek(progress) {
      this.isPaused = false;
      const targetIndex = Math.round((progress / 100) * (this.sentences.length - 1));
      this.currentIndex = Math.min(
        Math.max(targetIndex, 0),
        this.sentences.length - 1
      );
      this.updateDisplay();
    }
  
    pause() {
      this.isPaused = true;
      clearTimeout(this.nextTimeout);
    }
  
    resume() {
      if (this.isPaused) {
        this.isPaused = false;
        this.updateDisplay();
      }
    }
  
    cleanup() {
      clearTimeout(this.nextTimeout);
    }
  }