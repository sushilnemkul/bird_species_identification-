import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const ImageUpload = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearImage = (e) => {
      e.stopPropagation();
      setPreview(null);
      onImageSelect(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${preview ? 'bg-gray-50 border-solid' : 'bg-white'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleChange}
        />

        {preview ? (
          <div className="relative h-64 w-full flex items-center justify-center">
             <img src={preview} alt="Upload preview" className="max-h-full max-w-full rounded-lg shadow-md object-contain" />
             <button 
                onClick={clearImage}
                className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-white transition-all shadow-sm"
             >
                 <FaTimes />
             </button>
          </div>
        ) : (
          <div className="py-12">
            <FaCloudUploadAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-600">
              Drag & Drop your bird ID here
            </p>
            <p className="text-sm text-gray-400 mt-2">
              or click to browse from device
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Supports JPG, PNG (Max 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
};

export default ImageUpload;
