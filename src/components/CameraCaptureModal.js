import { useRef, useCallback, Fragment, useState, useEffect } from "react";
import Camera from "react-webcam";

const videoConstraints = {
  width: {
    min: 320,
    max: 1280,
  },
  height: {
    min: 240,
    max: 720,
  },
  frameRate: {
    max: 60,
    min: 10,
    ideal: 60,
  },
  // for dev/testing camera flows on machine => facingMode : 'user',
  // facingMode: { exact: 'environment' },
  facingMode: "user",
};

const CameraUI = ({ onClickPicture, onClose, camHeight }) => {
  const cam = useRef(null);
  const fileInput = useRef(null);

  const handlePhotoClick = useCallback(
    ({ imageSource }) => {
      let uri = cam.current.getScreenshot();
      if (!uri) return;
      const image = document.createElement("img");
      const width = window.innerWidth;
      const height = camHeight;
      image.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        const x = 0;
        const y = 0;
        const imageHeight = height;
        const imageWidth = width;

        ctx.drawImage(
          image,
          x,
          y,
          imageWidth,
          imageHeight,
          0,
          0,
          imageWidth,
          imageHeight
        );

        uri = canvas.toDataURL();
        onClickPicture({ uri, isUploaded: true, imageSource });
      };
      image.src = uri;
    },
    [camHeight, onClickPicture]
  );

  const handleGalleryClick = () => {
    fileInput.current.click();
  };

  const handleFileInput = ({ e, imageSource }) => {
    const file = e.target.files[0];
    getBase64(file, (uri) => {
      onClickPicture({ uri, isUploaded: true, imageSource });
    });
  };

  const handleCloseButton = () => {
    onClose && onClose();
  };

  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  if (
    !(
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    )
  ) {
    return (
      <div>
        <h1>{`Something's wrong with camera ... please check`}</h1>
      </div>
    );
  }

  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-black">
      <div className=" relative  w-full h-full bg-black">
        <div
          onClick={handleCloseButton}
          className=" absolute right-2 top-2 text-white"
        >
          close
        </div>
        <Camera
          audio={false}
          screenshotFormat="image/png"
          screenshotQuality={1}
          ref={cam}
          height={camHeight}
        className={" h-full max-w-[none]"}
          videoConstraints={videoConstraints}
        />

        <div
          className={
            "flex justify-around items-center absolute h-24 w-full px-3 bottom-0"
          }
        >
          <div className=" flex items-center justify-center " onClick={handleGalleryClick}>
            <div
            >
              gallery
            </div>
            <p className="ml-1.5 text-white font-bold text-sm ">Gallery</p>
            <input
              type="file"
              accept="image/*"
              className={" hidden "}
              ref={fileInput}
              onChange={(e) => handleFileInput({ e, imageSource: "gallery" })}
            />
          </div>
          <div
            className={
              " w-[75px] h-[75px] border-solid rounded-full border-4 border-[#1f8ffb]"
            }
            onClick={() => handlePhotoClick({ imageSource: "camera" })}
          >
            <div className={"w-full h-full bg-white rounded-full"}></div>
          </div>
          <div className={" w-[75px] h-[75px] "}></div>
        </div>
      </div>
    </div>
  );
};

export default CameraUI;
