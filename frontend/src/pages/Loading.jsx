import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
function Loading() {
    const [currentText, setCurrentText] = useState("You gonna be here for a while...");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const loadingMessages = [
        "Still loading... hang in there!",
        "This is taking longer than expected...",
        "Almost there... probably.",
        "Loading pixels one by one...",
        "Taking a coffee break...",
        "Gathering resources...",
        "Did you know? Loading screens are just digital waiting rooms.",
        "Plot twist: The loading is loading.",
        "You gonna be here for a while..."
    ];

    const loadingImages = [
        '/images/loading0.svg',
        '/images/loading1.svg',
        '/images/loading2.svg',
        '/images/loading3.svg',
        '/images/loading4.svg',
        '/images/loading5.svg'
    ];    useEffect(() => {
        setInterval(() => {
            const img = document.querySelector('.loading-image');
            const text = document.querySelector('.loading-container h2');
            
            // Add fade out class
            img.classList.add('fade');
            text.style.opacity = '0';
            
            // Wait for fade out, then update content
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * loadingMessages.length);
                setCurrentText(loadingMessages[randomIndex]);
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % loadingImages.length);
                
                // Remove fade class to fade in new content
                img.classList.remove('fade');
                text.style.opacity = '1';
            }, 500); 
            
        }, 10000);
    }, []);

    return (
        <div className="whole-page_loading">
            <Header/>
            <div className="loading-container">
                    <div className="loading-image-container">       
                       <img src={loadingImages[currentImageIndex]} alt="Loading..." className="loading-image" />
                    </div>
                    <div>
                        <h2>{currentText}</h2>
                    </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Loading;