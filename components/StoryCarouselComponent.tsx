'use client'; 

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";

const StoryCarouselComponent = ({ movies }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for upward, -1 for downward
  const animationRef = useRef(null);
  const itemHeight = 170; // Increased to account for margin
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
      
      // Get track and container heights
      const trackHeight = trackRef.current.clientHeight / 2; // Divide by 2 because we cloned items
      const containerHeight = containerRef.current.clientHeight;
      
      // Change direction when reaching top or bottom
      if (newPosition >= trackHeight - containerHeight && scrollDirection > 0) {
        setScrollDirection(-1); // Change to downward
      } else if (newPosition <= 0 && scrollDirection < 0) {
        setScrollDirection(1); // Change to upward
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

  // Calculate the total height considering the added margins
  const totalHeight = movies.length * (itemHeight + itemMargin) * 2;

    return (
        <div 
        className="w-full h-[600px] flex justify-end rounded-lg overflow-hidden relative bg-transparent p-2"
        ref={containerRef}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        >
            <div 
                className="absolute w-[350px] px-2"
                ref={trackRef}
                style={{ 
                transform: `translateY(${-scrollPosition}px)`,
                transition: 'transform 0.3s ease-out',
                height: `${totalHeight}px`  // Adjusted height for margins
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Original items */}
                {movies.map((movie, index) => (
                //   <div 
                //     key={`original-${index}`}
                //     className="w-full h-[150px] p-4 mb-[10px] flex flex-col justify-between bg-white rounded-lg shadow-sm"
                //     style={{ marginBottom: `${itemMargin}px` }}
                //   >
                //     <div className="text-lg font-bold text-gray-800">{movie.title}</div>
                //     <div className="text-sm text-gray-600 my-2 flex-grow">{movie.description}</div>
                //     <div className="flex items-center">
                //       <span className="text-yellow-400 mr-1">{generateStars(movie.rating)}</span>
                //       <span className="font-bold text-sm">{movie.rating}/5</span>
                //     </div>
                //   </div>
                    <div className="story-card" key={`original-${index}`} style={{ marginBottom: `${itemMargin}px` }}>
                        <img src={movie.image} alt="placeholder"  className="card-image"/>                
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
                //   <div 
                //     key={`clone-${index}`}
                //     className="w-full h-[150px] p-4 flex flex-col justify-between bg-white rounded-lg shadow-sm"
                //     style={{ marginBottom: `${itemMargin}px` }}
                //   >
                //     <div className="text-lg font-bold text-gray-800">{movie.title}</div>
                //     <div className="text-sm text-gray-600 my-2 flex-grow">{movie.description}</div>
                //     <div className="flex items-center">
                //       <span className="text-yellow-400 mr-1">{generateStars(movie.rating)}</span>
                //       <span className="font-bold text-sm">{movie.rating}/5</span>
                //     </div>
                //   </div>
                    <div className="story-card" key={`clone-${index}`} style={{ marginBottom: `${itemMargin}px` }}>
                        <img src={movie.image} alt="placeholder"  className="card-image"/>                
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

export default StoryCarouselComponent;