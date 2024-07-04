import { useState, Fragment, useCallback } from "react";
import PropTypes from "prop-types";
import ReactCrop from "react-image-crop";
import { useSpring, animated } from "react-spring";


const ImageEditorModal = ({
  uri,
  onRetakeClick,
  onUploadImage,
  isWeb,
  onRotateRightClick,
  onRotateLeftClick,
  onDeleteImageClick,
}) => {
  const [crop, setCrop] = useState({
    unit: "%",
    height: 90,
    width: 90,
    x: 5,
    y: 5,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imgRef, setImgRef] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(uri);

  const { w } = useSpring({
    to: async (next) => {
      let x = 0;
      while (x <= 100) {
        await next({ w: 0 });
        await next({ w: 1 });
        x++;
      }
    },
    from: { w: 0 },
    config: {
      duration: 1000,
    },
  });

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const handleCropComplete = async (crop) => {
    if (imgRef && crop.width && crop.height) {
      createCropPreview(imgRef, crop);
    }
  };

  const createCropPreview = async (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    setPreviewUrl(canvas.toDataURL());
  };

  const handleClick = () => {
    setIsUploading(true);
    onUploadImage(previewUrl);
  };

  const handleRetakeClick = () => {
    onRetakeClick();
  };

  const handleRotateClockWiseClick = () => {
    imgRef && onRotateRightClick && onRotateRightClick(imgRef, 90);
    setCrop({
      unit: "%",
      height: 90,
      width: 90,
      x: 5,
      y: 5,
    });
  };
  const handleRotateAntiClockWiseClick = () => {
    imgRef && onRotateLeftClick && onRotateLeftClick(imgRef, -90);
    setCrop({
      unit: "%",
      height: 90,
      width: 90,
      x: 5,
      y: 5,
    });
  };

  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-black">
      <div
        className={`relative m-0  w-full h-full bg-black flex flex-col items-center justify-center`}
      >
        <p
          className={" mb-0 absolute bottom-[120px] font-bold  text-xs "}
        >
        </p>
        <ReactCrop
          src={uri || ""}
          onImageLoaded={onLoad}
          crop={crop}
          imageStyle={{
            maxHeight: isWeb ? "400px" : "350px",
            maxWidth: isWeb ? "400px" : "350px",
          }}
          style={{ overflow: "visible" }}
          keepSelection={true}
          onChange={(crop) => setCrop(crop)}
          onComplete={handleCropComplete}
          // className={isUploading ? styles.hide : null}
          className={` ${isUploading ? "!hidden" : null}`}
        />

        <div
         className={` ${isUploading ? "": " !hidden "} py-5 uploader max-h-[60%] relative`}
         >
          <div 
          className={`animator-upload`}
          >
            <animated.p
              className={'left'}
              style={{
                width: w.interpolate((w) => `${w * (window.innerWidth - 3)}px`),
              }}
            ></animated.p>
            <p className={'stick'}></p>
            <animated.p
              className={'right'}
              style={{
                width: w.interpolate(
                  (w) => `${(1 - w) * (window.innerWidth - 3)}px`
                ),
              }}
            ></animated.p>
          </div>
          <img src={previewUrl} alt={"preview"} />
        </div>

        <div
          className={` absolute px-5 w-full bottom-5 flex flex-col items-center ${
            isUploading ? "!hidden" : ""
          }`}
        >
          <div
            className={` flex w-[calc(100%-40px)] items-center h-[70px] justify-between`}
          >
            <div
              className={" flex items-center"}
              onClick={handleRetakeClick}
            >
              <p
                className={
                  "text-xs text-white tracking-[-0.8px] ml-[7px] font-bold mb-1"
                }
              >
                Retake
              </p>
            </div>
            <div
              className={` w-16 h-16 rounded-full bg-[#1f8ffb] flex items-center justify-center pt-1`}
              onClick={handleClick}
            >
            </div>
            <div
              className={" flex items-center"}
              onClick={handleRotateAntiClockWiseClick}
            >
              <p
                className={
                  "text-xs text-white tracking-[-0.8px] ml-[7px] font-bold mb-1"
                }
              >
                Rotate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ImageEditorModal.propTypes = {
  uri: PropTypes.string.isRequired,
  isUploadedImage: PropTypes.bool.isRequired,
  onRetakeClick: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  isWeb: PropTypes.bool,
  onRotateRightClick: PropTypes.func,
  onRotateLeftClick: PropTypes.func,
  onDeleteImageClick: PropTypes.func,
};

export default ImageEditorModal;
