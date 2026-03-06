import { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaCloudUploadAlt, FaTimes, FaCropAlt, FaCheck } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setOriginalFile(file);
        setIsCropping(true); // Open cropper immediately
      };
      reader.readAsDataURL(file);
    } else if (file) {
        toast.error("Please upload a valid image file.");
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
      e?.stopPropagation();
      setPreview(null);
      setOriginalFile(null);
      setIsCropping(false);
      onImageSelect(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async (e) => {
      e.stopPropagation();
      try {
        const croppedFile = await getCroppedImg(
            preview,
            croppedAreaPixels,
            originalFile.name
        );
        // Replace preview with cropped image
        const newPreview = URL.createObjectURL(croppedFile);
        setPreview(newPreview);
        setIsCropping(false);
        onImageSelect(croppedFile);
      } catch (e) {
        console.error("Failed to crop image", e);
        toast.error("Failed to crop the image.");
      }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-0 text-center transition-colors
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${preview ? 'bg-gray-50 border-solid' : 'bg-white cursor-pointer'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => { if(!preview) fileInputRef.current.click() }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleChange}
        />

        {preview ? (
            isCropping ? (
                // Cropping UI
                <div className="relative h-[400px] w-full rounded-xl overflow-hidden bg-black/90">
                    <Cropper
                        image={preview}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                    
                    {/* Zoom Slider */}
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3/4 max-w-sm bg-black/50 p-3 rounded-xl backdrop-blur-md flex items-center gap-4">
                        <span className="text-white text-sm font-bold">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => {
                                setZoom(e.target.value)
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-4 left-0 w-full flex justify-between px-6">
                        <button 
                            onClick={clearImage}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                            <FaTimes /> Cancel
                        </button>
                        <button 
                            onClick={handleConfirmCrop}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                            <FaCropAlt /> Apply Crop
                        </button>
                    </div>
                </div>
            ) : (
                // Confirmed Preview UI
                <div className="relative h-64 w-full flex items-center justify-center p-4">
                    <img src={preview} alt="Upload preview" className="max-h-full max-w-full rounded-lg shadow-md object-contain" />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsCropping(true); }}
                            className="bg-white/90 p-2.5 rounded-xl text-primary hover:text-white hover:bg-primary transition-all shadow-md group relative tooltip-wrap"
                            title="Edit Crop"
                        >
                            <FaCropAlt className="text-lg" />
                        </button>
                        <button 
                            onClick={clearImage}
                            className="bg-white/90 p-2.5 rounded-xl text-red-500 hover:text-white hover:bg-red-500 transition-all shadow-md"
                            title="Remove"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    </div>
                    {/* Success indicator layer */}
                    <div className="absolute bottom-4 right-4 bg-green-500/90 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm">
                        <FaCheck /> Ready to Identity
                    </div>
                </div>
            )
        ) : (
          <div className="py-16">
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
