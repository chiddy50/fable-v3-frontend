'use client'; 

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";

const StoryVerticalCarouselComponent = ({ movies }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  const animationRef = useRef(null);
  const itemWidth = 300; // Width of each card
  const itemMargin = 10; // Margin between items

  // Generate star rating display
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  // Auto scroll function
  const autoScroll = () => {
    if (!isScrolling || !trackRef.current || !containerRef.current) return;
    
    // Update scroll position based on direction
    setScrollPosition((prevPosition) => {
      const newPosition = prevPosition + 1.5 * scrollDirection;
      
      // Get track and container widths
      const trackWidth = trackRef.current.clientWidth / 2; // Divide by 2 because we cloned items
      const containerWidth = containerRef.current.clientWidth;
      
      // Change direction when reaching left or right edge
      if (newPosition >= trackWidth - containerWidth && scrollDirection > 0) {
        setScrollDirection(-1); // Change to leftward
      } else if (newPosition <= 0 && scrollDirection < 0) {
        setScrollDirection(1); // Change to rightward
      }
      
      return newPosition;
    });
    
    animationRef.current = requestAnimationFrame(autoScroll);
  };

  // Start the animation
  useEffect(() => {
    // Start auto scrolling
    animationRef.current = requestAnimationFrame(autoScroll);
    
    // Cleanup animation frame on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScrolling, scrollDirection]);

  // Handler for mouse enter
  const handleMouseEnter = () => {
    setIsScrolling(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Handler for mouse leave
  const handleMouseLeave = () => {
    setIsScrolling(true);
    animationRef.current = requestAnimationFrame(autoScroll);
  };

  // Calculate the total width considering the added margins
  const totalWidth = movies.length * (itemWidth + itemMargin) * 2;

  return (
    <div 
      className="w-full h-[400px] flex items-center rounded-lg overflow-hidden relative bg-transparent p-2"
      ref={containerRef}
    >
      <div 
        className="absolute h-full flex flex-row"
        ref={trackRef}
        style={{ 
          transform: `translateX(${-scrollPosition}px)`,
          transition: 'transform 0.3s ease-out',
          width: `${totalWidth}px`  // Adjusted width for margins
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Original items */}
        {movies.map((movie, index) => (
          <div 
            className="story-card" 
            key={`original-${index}`} 
            style={{ 
              marginRight: `${itemMargin}px`,
              width: `${itemWidth}px`,
              flex: `0 0 ${itemWidth}px`
            }}
          >
            <img src={movie.image} alt="placeholder" className="card-image"/>                
            <div className="read-time">15m Read</div>
            <div className="card-info">
              <div>
                <h3 className="card-title">{movie.title}</h3>
                <p className="card-author">@chidix</p>
              </div>
              <div className="card-rating text-xs">★★★ {movie.rating}/5</div>
            </div>
          </div>
        ))}

        {/* Cloned items for seamless scrolling */}
        {movies.map((movie, index) => (
          <div 
            className="story-card" 
            key={`clone-${index}`} 
            style={{ 
              marginRight: `${itemMargin}px`,
              width: `${itemWidth}px`,
              flex: `0 0 ${itemWidth}px`
            }}
          >
            <img src={movie.image} alt="placeholder" className="card-image"/>                
            <div className="read-time text-xs">15m Read</div>
            <div className="card-info">
              <div>
                <h3 className="card-title">{movie.title}</h3>
                <p className="card-author">@chidix</p>
              </div>
              <div className="card-rating text-xs">★★★ {movie.rating}/5</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryVerticalCarouselComponent;