import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageModal = ({ isOpen, onClose, imageUrl, altText, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(imageUrl);

  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
        if (images.length > 0) {
            const idx = images.indexOf(imageUrl);
            setCurrentIndex(idx >= 0 ? idx : 0);
            setCurrentImage(imageUrl);
        } else {
            setCurrentImage(imageUrl);
        }
    }
  }, [isOpen, imageUrl, images]);

  // Update current image when index changes
  useEffect(() => {
    if (images.length > 0 && currentIndex >= 0 && currentIndex < images.length) {
        setCurrentImage(images[currentIndex]);
    }
  }, [currentIndex, images]);

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20"
        onClick={onClose}
      >
        <FaTimes size={24} />
      </button>

      {images.length > 1 && (
        <>
            <button 
                className="absolute left-4 z-40 text-white/70 hover:text-white transition-colors bg-white/10 p-4 rounded-full hover:bg-white/20"
                onClick={handlePrev}
            >
                <FaChevronLeft size={32} />
            </button>
            <button 
                className="absolute right-4 z-40 text-white/70 hover:text-white transition-colors bg-white/10 p-4 rounded-full hover:bg-white/20"
                onClick={handleNext}
            >
                <FaChevronRight size={32} />
            </button>
        </>
      )}
      
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={currentImage} 
          alt={altText} 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        {images.length > 1 && (
             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {currentIndex + 1} / {images.length}
             </div>
        )}
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
};

export default ImageModal;
