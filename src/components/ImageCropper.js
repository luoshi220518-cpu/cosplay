import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Check } from "lucide-react";
import "./ImageCropper.css";

const ImageCropper = ({
  imageSrc,
  onCrop,
  onCancel,
  cropShape = "circle", // circle / rect
  aspectRatio = 1, // 仅在 rect 下生效，width / height
  outputWidth = 200, // 输出宽度（rect 使用）
  outputHeight = 200, // 输出高度（rect 使用）
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 加载图片 & 计算显示尺寸
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        setImageLoaded(true);

        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerWidth = containerRect.width;
          const containerHeight = containerRect.height;

          const imageAspect = img.width / img.height;
          const containerAspect = containerWidth / containerHeight;

          let displayWidth, displayHeight;

          if (imageAspect > containerAspect) {
            // 图片更宽，以高度为准
            displayHeight = containerHeight;
            displayWidth = displayHeight * imageAspect;
          } else {
            // 图片更高，以宽度为准
            displayWidth = containerWidth;
            displayHeight = displayWidth / imageAspect;
          }

          setDisplaySize({ width: displayWidth, height: displayHeight });
          setCrop({ x: 0, y: 0 }); // 初始偏移为 0
          setZoom(1);
        }
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // 创建图片对象
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });

  // 生成裁剪后的图片
  const getCroppedImg = async (imageSrc, cropPosition, zoomValue) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 计算输出尺寸
    const isCircle = cropShape === "circle";
    const cropSize = 200;
    const targetWidth = isCircle ? cropSize : outputWidth;
    const targetHeight = isCircle ? cropSize : outputHeight;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    const scaledWidth = displaySize.width * zoomValue;
    const scaledHeight = displaySize.height * zoomValue;

    // 裁剪框大小（相对于容器，80%）
    let frameWidth;
    let frameHeight;
    if (isCircle) {
      const size = Math.min(containerWidth, containerHeight) * 0.8;
      frameWidth = size;
      frameHeight = size;
    } else {
      // 矩形裁剪：根据期望的宽高比自适应容器
      const maxWidth = containerWidth * 0.8;
      const maxHeight = containerHeight * 0.8;
      const containerAspect = maxWidth / maxHeight;
      if (containerAspect > aspectRatio) {
        // 容器较宽，以高度为基准
        frameHeight = maxHeight;
        frameWidth = frameHeight * aspectRatio;
      } else {
        // 容器较高，以宽度为基准
        frameWidth = maxWidth;
        frameHeight = frameWidth / aspectRatio;
      }
    }

    // 图片中心点对齐容器中心
    const offsetX = containerWidth / 2 - scaledWidth / 2 + cropPosition.x;
    const offsetY = containerHeight / 2 - scaledHeight / 2 + cropPosition.y;

    const scaleX = imageSize.width / scaledWidth;
    const scaleY = imageSize.height / scaledHeight;

    // 计算源图截取区域
    const sourceX = (containerWidth - frameWidth) / 2 - offsetX;
    const sourceY = (containerHeight - frameHeight) / 2 - offsetY;
    const sourceWidth = frameWidth;
    const sourceHeight = frameHeight;

    ctx.save();

    if (isCircle) {
      ctx.beginPath();
      ctx.arc(targetWidth / 2, targetHeight / 2, Math.min(targetWidth, targetHeight) / 2, 0, 2 * Math.PI);
      ctx.clip();
    }

    ctx.drawImage(
      image,
      sourceX * scaleX,
      sourceY * scaleY,
      sourceWidth * scaleX,
      sourceHeight * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }, "image/jpeg");
    });
  };

  // 拖拽
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX - crop.x, y: e.clientY - crop.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();

    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    setCrop({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // 确认裁剪
  const handleConfirmCrop = useCallback(async () => {
    try {
      const croppedImageData = await getCroppedImg(imageSrc, crop, zoom);
      onCrop(croppedImageData);
    } catch (e) {
      console.error("裁剪失败:", e);
    }
  }, [imageSrc, crop, zoom, onCrop]);

  return (
    <div className="image-cropper">
      <div className="cropper-header">
        <h3>裁剪图片</h3>
        <div className="cropper-actions">
          <button className="cancel-btn" onClick={onCancel}>
            <X size={16} /> 取消
          </button>
          <button className="confirm-btn" onClick={handleConfirmCrop}>
            <Check size={16} /> 确认
          </button>
        </div>
      </div>

      <div className="cropper-body">
        <div
          className="cropper-container"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {imageLoaded && (
            <>
              <img
                src={imageSrc}
                alt="裁剪预览"
                className="crop-image"
                style={{
                  width: displaySize.width,
                  height: displaySize.height,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(${crop.x}px, ${crop.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  cursor: "grab",
                }}
                onMouseDown={handleMouseDown}
                draggable={false}
              />

              {/* 裁剪框 */}
              <div
                className={`crop-frame ${
                  cropShape === "circle" ? "circle" : "rect"
                }`}
              />
            </>
          )}
        </div>
      </div>

      <div className="cropper-controls">
        <div className="zoom-control">
          <label>缩放:</label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
          <span>{zoom.toFixed(1)}x</span>
        </div>
      </div>

      <div className="cropper-footer">
        <p>拖拽图片调整位置，使用滑块调整缩放</p>
      </div>
    </div>
  );
};

export default ImageCropper;
