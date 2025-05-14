class ParagraphAnimator {
  constructor(container, startTime, tempo) {
    this.container = container;
    this.startTime = startTime;
    this.tempo = tempo || 120; // Default to 120 BPM
    this.sentences = []; // Will store DOM elements
    this.currentIndex = -1; // Start at -1 to force initial transition
    this.lyricTimings = [];
    this.isAnimating = false;

    this.init();
  }

  init() {
    // Get lyrics text and split into sentences
    const lyricsText = this.container.textContent;
    const sentenceTexts = lyricsText.split('\n').filter(sentence => sentence.trim() !== '');
    
    if (sentenceTexts.length === 0) {
      console.warn("No valid sentences found in lyrics");
      return;
    }

    // Clear the container
    this.container.innerHTML = '';

    // Create sentence elements and store them in this.sentences
    this.sentences = sentenceTexts.map((sentence, index) => {
      const sentenceElement = document.createElement('span');
      sentenceElement.className = 'sentence';
      sentenceElement.textContent = sentence.trim();
      sentenceElement.style.position = 'absolute';
      sentenceElement.style.left = '100%';
      sentenceElement.style.transform = 'translateX(0%) translateY(-50%)';
      sentenceElement.style.opacity = '0';
      if (index === 0) {
        sentenceElement.classList.add('current');
        sentenceElement.style.left = '50%';
        sentenceElement.style.transform = 'translateX(-50%) translateY(-50%)';
        sentenceElement.style.opacity = '1';
      } else if (index === 1) {
        sentenceElement.classList.add('next');
        sentenceElement.style.opacity = '0.3';
      } else {
        sentenceElement.classList.add('hidden');
      }
      this.container.appendChild(sentenceElement);
      return sentenceElement; // Store the DOM element
    });

    // Log for debugging
    console.log(`Initialized ${this.sentences.length} sentence elements`);
  }

  setTimings(audioDuration) {
    if (isNaN(audioDuration) || audioDuration <= 0) {
      console.warn("Invalid audio duration, cannot set timings");
      return;
    }

    // Distribute sentences evenly across audio duration
    const sentenceCount = this.sentences.length;
    const sentenceDuration = audioDuration / sentenceCount;
    
    this.lyricTimings = this.sentences.map((_, index) => ({
      start: index * sentenceDuration,
      end: (index + 1) * sentenceDuration,
    }));

    console.log("Timings set:", this.lyricTimings);
  }

  update(currentTime, audioDuration) {
    if (!this.isAnimating || this.sentences.length === 0) return;

    // Initialize timings if not set and audio duration is available
    if (this.lyricTimings.length === 0 && !isNaN(audioDuration) && audioDuration > 0) {
      this.setTimings(audioDuration);
    }

    if (this.lyricTimings.length === 0) return;

    // Find the current sentence based on audio time
    let currentSentenceIndex = this.lyricTimings.findIndex(
      timing => currentTime >= timing.start && currentTime < timing.end
    );

    // Handle edge case: if currentTime exceeds last timing, show last sentence
    if (currentSentenceIndex === -1 && currentTime >= this.lyricTimings[this.lyricTimings.length - 1].start) {
      currentSentenceIndex = this.lyricTimings.length - 1;
    }

    if (currentSentenceIndex !== -1 && currentSentenceIndex !== this.currentIndex) {
      this.transitionToSentence(currentSentenceIndex);
    }
  }

  transitionToSentence(newIndex) {
    if (newIndex < 0 || newIndex >= this.sentences.length) return;

    // Reset previous sentence
    const prevSentence = this.sentences[this.currentIndex];
    if (prevSentence) {
      prevSentence.className = 'sentence exiting';
      setTimeout(() => {
        prevSentence.className = 'sentence hidden';
        prevSentence.style.left = '100%';
        prevSentence.style.transform = 'translateX(0%) translateY(-50%)';
        prevSentence.style.opacity = '0';
      }, 700); // Match CSS transition duration
    }

    // Update current sentence
    const currentSentence = this.sentences[newIndex];
    if (currentSentence) {
      currentSentence.className = 'sentence current';
      currentSentence.style.left = '50%';
      currentSentence.style.transform = 'translateX(-50%) translateY(-50%)';
      currentSentence.style.opacity = '1';
    }

    // Prepare next sentence
    const nextIndex = newIndex + 1;
    if (nextIndex < this.sentences.length) {
      const nextSentence = this.sentences[nextIndex];
      nextSentence.className = 'sentence next';
      nextSentence.style.left = '100%';
      nextSentence.style.transform = 'translateX(0%) translateY(-50%)';
      nextSentence.style.opacity = '0.3';
    }

    // Hide sentences after the next one
    for (let i = newIndex + 2; i < this.sentences.length; i++) {
      const sentence = this.sentences[i];
      sentence.className = 'sentence hidden';
      sentence.style.left = '100%';
      sentence.style.transform = 'translateX(0%) translateY(-50%)';
      sentence.style.opacity = '0';
    }

    this.currentIndex = newIndex;
    console.log(`Transitioned to sentence ${newIndex}: ${this.sentences[newIndex].textContent}`);
  }

  start() {
    this.isAnimating = true;
    console.log("Animation started");
  }

  stop() {
    this.isAnimating = false;
    console.log("Animation stopped");
  }

  cleanup() {
    this.stop();
    this.container.innerHTML = '';
    this.sentences = [];
    this.lyricTimings = [];
    this.currentIndex = -1;
    console.log("Animator cleaned up");
  }
}
export default ParagraphAnimator;