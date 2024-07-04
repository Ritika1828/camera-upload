// src/App.js
import React, { useState } from 'react';
import CameraCaptureModal from './components/CameraCaptureModal';
import ImageEditorModal from './components/ImageEditorModal';
import 'tailwindcss/tailwind.css';
import './App.css'

const App = () => {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);
  const [imageSource, setImageSource] = useState(null);

  const height =  window?.innerHeight;

  const openCameraModal = () => {
    setIsCameraModalOpen(true);
  };

  const closeCameraModal = () => {
    setIsCameraModalOpen(false);
  };

  const handleCapture = (imageSrc) => {
    // setCapturedImage(imageSrc);
    closeCameraModal();
    setIsEditorModalOpen(true);
  };

  const closeEditorModal = () => {
    setIsEditorModalOpen(false);
  };

 
  const handleRetakeClick = () => {
    setIsCameraModalOpen(true);
    setOpenCropper(false);
    setImage('');
};

const handleRotateLeftClick = (img, degree = 90) => {
  let rotateImg = new Image();
  rotateImg.src = img.src;
  const canvas = document.createElement('canvas');
  const scaleX = rotateImg.naturalWidth / rotateImg.width;
  const scaleY = rotateImg.naturalHeight / rotateImg.height;
  canvas.width = rotateImg.height;
  canvas.height = rotateImg.width;

  const ctx = canvas.getContext('2d');

  ctx.translate(0, ctx.canvas.height);
  ctx.rotate((degree * Math.PI) / 180);
  ctx.drawImage(
      rotateImg,
      0,
      0,
      rotateImg.width * scaleY,
      rotateImg.height * scaleX,
      0,
      0,
      rotateImg.width,
      rotateImg.height
  );
  setImage(canvas.toDataURL());
};


  const onClickPicture = ({ uri, isUploaded, imageSource }) => {
    setImage(uri)
    setIsUploadedImage(isUploaded);
    setImageSource(imageSource);
    setOpenCropper(true);
    closeCameraModal && closeCameraModal()

  }

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <button onClick={openCameraModal} className="bg-blue-500 text-white p-2 rounded">
        Open Camera
      </button>
      {
        isCameraModalOpen ? (
          <CameraCaptureModal
          onClickPicture={onClickPicture} 
           onClose={closeCameraModal}
          camHeight={height}
         />
        ): null
      }
    
    {openCropper && (
                <ImageEditorModal
                    uri={image}
                    isUploadedImage={isUploadedImage}
                    onRetakeClick={handleRetakeClick}
                    onUploadImage={()=>{}}
                    onRotateLeftClick={handleRotateLeftClick}
                />
            )}
    </div>
  );
};

export default App;
