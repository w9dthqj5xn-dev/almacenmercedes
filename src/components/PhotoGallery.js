import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../styles/PhotoGallery.css';

const PhotoGallery = ({ photos, productName, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div 
      className="gallery-modal" 
      onClick={(e) => {
        if (e.target.classList.contains('gallery-modal')) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="gallery-container">
        {/* Encabezado */}
        <div className="gallery-header">
          <h3>{productName}</h3>
          <button className="close-btn" onClick={onClose} title="Cerrar (Esc)">
            <X size={24} />
          </button>
        </div>

        {/* Imagen principal */}
        <div className="gallery-main">
          <img src={currentPhoto} alt={`${productName} - ${currentIndex + 1}`} />
        </div>

        {/* Navegación */}
        {photos.length > 1 && (
          <>
            <button
              className="gallery-nav prev-btn"
              onClick={handlePrevious}
              title="Foto anterior (←)"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              className="gallery-nav next-btn"
              onClick={handleNext}
              title="Foto siguiente (→)"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Contador de fotos */}
        <div className="gallery-counter">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Miniaturas */}
        {photos.length > 1 && (
          <div className="gallery-thumbnails">
            {photos.map((photo, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                title={`Foto ${index + 1}`}
              >
                <img src={photo} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
