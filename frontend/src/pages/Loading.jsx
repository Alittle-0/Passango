import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Loading() {
  const [currentText, setCurrentText] = useState(
    "You gonna be here for a while..."
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const intervalRef = useRef(null);

  const loadingMessages = [
    "Still loading... hang in there!",
    "This is taking longer than expected...",
    "Almost there... probably.",
    "Loading pixels one by one...",
    "Taking a coffee break...",
    "Gathering resources...",
    "Did you know? Loading screens are just digital waiting rooms.",
    "Plot twist: The loading is loading.",
    "You gonna be here for a while...",
  ];

  const loadingImages = [
    "/images/loading0.svg",
    "/images/loading1.svg",
    "/images/loading2.svg",
    "/images/loading3.svg",
    "/images/loading4.svg",
    "/images/loading5.svg",
  ];

  useEffect(() => {
    const updateContent = () => {
      if (!imgRef.current || !textRef.current) return;

      setIsFading(true);

      // Fade out
      imgRef.current.classList.add("fade");
      textRef.current.style.opacity = "0";

      setTimeout(() => {
        // Update content
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setCurrentText(loadingMessages[randomIndex]);
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % loadingImages.length
        );

        // Fade in
        if (imgRef.current && textRef.current) {
          imgRef.current.classList.remove("fade");
          textRef.current.style.opacity = "1";
        }
        setIsFading(false);
      }, 500);
    };

    // Start interval after initial render
    intervalRef.current = setInterval(updateContent, 10000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="whole-page_loading">
      <Header />
      <div className="loading-container">
        <div className="loading-image-container">
          <img
            ref={imgRef}
            src={loadingImages[currentImageIndex]}
            alt="Loading..."
            className={`loading-image ${isFading ? "fade" : ""}`}
          />
        </div>
        <div>
          <h2
            ref={textRef}
            style={{
              transition: "opacity 0.5s ease-in-out",
              opacity: isFading ? 0 : 1,
            }}
          >
            {currentText}
          </h2>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Loading;
