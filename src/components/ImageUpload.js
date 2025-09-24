import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import './ImageUpload.css';
import imageService from '../services/imageService';

const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  type = 'avatar', 
  size = 'medium',
  showPreview = true,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const imageData = await imageService.uploadImage(file, type);
      setPreview(imageData);
      onImageChange(imageData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    setError('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'size-small';
      case 'large': return 'size-large';
      default: return 'size-medium';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'avatar': return <Camera size={20} />;
      case 'background': return <ImageIcon size={20} />;
      default: return <Upload size={20} />;
    }
  };

  return (
    <div className={`image-upload ${getSizeClass()} ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {showPreview && preview ? (
        <div className="image-preview">
          <img src={preview} alt="预览" />
          <div className="image-overlay">
            <button 
              className="change-btn"
              onClick={handleClick}
              disabled={isUploading}
            >
              {isUploading ? '上传中...' : '更换'}
            </button>
            <button 
              className="remove-btn"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-placeholder" onClick={handleClick}>
          <div className="upload-icon">
            {getTypeIcon()}
          </div>
          <div className="upload-text">
            {isUploading ? '上传中...' : `点击上传${type === 'avatar' ? '头像' : type === 'background' ? '背景图' : '图片'}`}
          </div>
          <div className="upload-hint">
            支持 JPG、PNG、GIF、WebP 格式
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
