
import React, {useEffect, useRef, useState} from 'react';
import cv, { set, Mat } from "@techstark/opencv-js";

const canvasSize = { w: 360, h: 240 };
const logoSize = { w: 100, h: 100 };


export function ImageThresholding2() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoCanvasRef = useRef<HTMLCanvasElement>(null)
  const convertedCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    console.log("useEffect");

    if(logoCanvasRef.current){
      logoCanvasRef.current.id     = 'logoCanvas';
      logoCanvasRef.current.width  = logoSize.w;
      logoCanvasRef.current.height = logoSize.h;
      const logoContext = logoCanvasRef.current.getContext('2d');
      if(logoContext){
        var imgLogo = new Image();
        imgLogo.src = './logo.png';
        imgLogo.onload = function onImageLoad() {
          console.log("onImageLoad logo");
          logoContext.drawImage(imgLogo, 0, 0, logoSize.w, logoSize.h);

        }
        imgLogo.onerror = function onImageError(err) {
          console.log("ereror", err)
        }
      }
    }

    if(canvasRef.current){
      canvasRef.current.id     = 'canvas';
      canvasRef.current.width  = canvasSize.w;
      canvasRef.current.height = canvasSize.h;
      const context = canvasRef.current.getContext('2d');
      if(context){
        var img = new Image();

        img.src = './english.jpg';
        img.onload = function onImageLoad() {
          context.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
          setTimeout(()=>{

            // threshold()
            // adaptiveThreshold()
            // smoothingFilter()
            // smoothingGaussianBlur()
            // smoothingMedianBlur()
            smoothingBirateralFilter()

          }, 100);
        }
        img.onerror = function onImageError(err) {
          console.log("ereror", err)
        }
      }

    }else{
      console.log("canvasRef.current is null");
    }

    if(convertedCanvasRef.current)  {
      convertedCanvasRef.current.width  = canvasSize.w;
      convertedCanvasRef.current.height = canvasSize.h;
    }else{
      console.log("convertedCanvasRef.current is null");
    }
  }, [])


  const threshold = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      const thresh  = 177;
      const maxval  = 200;
    //   const type    = cv.THRESH_BINARY;
    //   const type    = cv.THRESH_BINARY_INV;
    //   const type    = cv.THRESH_TRUNC;
      const type    = cv.THRESH_TOZERO;
    //   const type    = cv.THRESH_OTSU;
    //   const type    = cv.THRESH_TRIANGLE;
      cv.threshold(src, dst, thresh, maxval, type);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }
  const adaptiveThreshold = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

      const maxval  = 200;
      // const adaptiveMethod = cv.ADAPTIVE_THRESH_MEAN_C
      const adaptiveMethod = cv.ADAPTIVE_THRESH_GAUSSIAN_C

      const thresholdType    = cv.THRESH_BINARY;
      // const thresholdType    = cv.THRESH_BINARY_INV;
      // const thresholdType    = cv.THRESH_TRUNC;
    // const thresholdType    = cv.THRESH_TOZERO;
      // const thresholdType    = cv.THRESH_OTSU;
      // const thresholdType    = cv.THRESH_TRIANGLE;

      const blockSize = 5
      const C = 2
      // You can try more different parameters

      cv.adaptiveThreshold(src, dst, maxval, adaptiveMethod, thresholdType, blockSize, C);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
      src.delete();
      dst.delete();
    }
}

const smoothingFilter = () => {
  if(canvasRef.current){
    const src: Mat =  cv.imread(canvasRef.current);

    let dst = new cv.Mat();
    let M = cv.Mat.eye(3, 3, cv.CV_32FC1);
    let anchor = new cv.Point(-1, -1);
    // You can try more different parameters
    cv.filter2D(src, dst, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);
    if(convertedCanvasRef.current){
      cv.imshow(convertedCanvasRef.current, dst);
    }
  }

}

const smoothingGaussianBlur = () => {
  if(canvasRef.current){
    const src: Mat =  cv.imread(canvasRef.current);

    let dst = new cv.Mat();
    let ksize = new cv.Size(17, 17);
    // You can try more different parameters
    cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    if(convertedCanvasRef.current){
      cv.imshow(convertedCanvasRef.current, dst);
    }
  }

}

const smoothingMedianBlur = () => {
  if(canvasRef.current){
    const src: Mat =  cv.imread(canvasRef.current);

    let dst = new cv.Mat();
    cv.medianBlur(src, dst, 77);
    if(convertedCanvasRef.current){
      cv.imshow(convertedCanvasRef.current, dst);
    }
  }

}

// これはレシートのノイズ除去に使えるかも
const smoothingBirateralFilter = () => {
  if(canvasRef.current){
    const src: Mat =  cv.imread(canvasRef.current);

    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
    // You can try more different parameters
    cv.bilateralFilter(src, dst, 50, 155, 155, cv.BORDER_DEFAULT);
    if(convertedCanvasRef.current){
      cv.imshow(convertedCanvasRef.current, dst);
    }
  }

}


  return (
    <div>
    <br />
    original
      <canvas  ref={canvasRef} />
    <br />
    convert
      <canvas  ref={convertedCanvasRef} />
      <br />
      logoCanvasRef
      <canvas  ref={logoCanvasRef} />
    </div>
  )
}
