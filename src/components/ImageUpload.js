import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import './ImageUpload.css';
import imageService from '../services/imageService';
import ImageCropper from './ImageCropper';

const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  type = 'avatar', 
  size = 'medium',
  showPreview = true,
  className = '',
  enableCrop = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      // 先验证文件
      imageService.validateFile(file);
      
      // 读取文件为base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setOriginalImage(imageData);
        
        if (enableCrop && type === 'avatar') {
          // 头像需要裁剪
          setShowCropper(true);
        } else {
          // 直接处理图片
          processImage(imageData);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError(error.message);
      setIsUploading(false);
    }
  };

  const processImage = async (imageData) => {
    try {
      // 如果不是头像，进行压缩处理
      if (type !== 'avatar') {
        const compressedData = await imageService.compressImageFromBase64(imageData, type);
        setPreview(compressedData);
        onImageChange(compressedData);
      } else {
        setPreview(imageData);
        onImageChange(imageData);
      }
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

  const handleCropComplete = (croppedImageData) => {
    // 裁剪完成后，立即应用裁剪后的图片
    setPreview(croppedImageData);
    onImageChange(croppedImageData);
    setShowCropper(false);
    setOriginalImage(null);
    setIsUploading(false);
    
    console.log('裁剪完成，圆形图片已应用');
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage(null);
    setIsUploading(false);
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
    <>
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

      {/* 图片裁剪弹窗 */}
      {showCropper && originalImage && (
        <div className="cropper-modal-overlay" onClick={handleCropCancel}>
          <div className="cropper-modal" onClick={(e) => e.stopPropagation()}>
            <ImageCropper
              imageSrc={originalImage}
              onCrop={handleCropComplete}
              onCancel={handleCropCancel}
              aspectRatio={1}
              cropShape="circle"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
