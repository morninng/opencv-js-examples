
import React, {useEffect, useRef, useState} from 'react';
import cv, { set, Mat } from "@techstark/opencv-js";

const canvasSize = { w: 360, h: 240 };
const logoSize = { w: 100, h: 100 };


export function ImageProcessingContours() {

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

        img.src = './meishi2.png';
        img.onload = function onImageLoad() {
          context.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
          setTimeout(()=>{
            // contourGettingStarted()
            // contourMoment()
            contourArea()

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


  const contourGettingStarted = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let coloredMat = new cv.Mat();
      let thresholdMat = new cv.Mat();

      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

      cv.cvtColor(src, coloredMat, cv.COLOR_RGBA2GRAY, 0);

      cv.threshold(coloredMat, thresholdMat, 0, 255, cv.THRESH_OTSU);
      // cv.threshold(coloredMat, thresholdMat, 10, 200, cv.THRESH_BINARY);
      // cv.bitwise_not(thresholdMat, thresholdMat);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(thresholdMat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
      const size = contours.size() as unknown as number
      for (let i = 0; i < size; ++i) {
          let color = new cv.Scalar(255, 0, 0);
          cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
      }
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }

  const contourMoment = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);

      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
      let cnt = contours.get(0);
      let Moments = cv.moments(cnt, true);
      console.log(Moments);


      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }


  const contourArea = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let coloredMat = new cv.Mat();
      let thresholdMat = new cv.Mat();

      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      cv.cvtColor(src, coloredMat, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(coloredMat, thresholdMat, 177, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(thresholdMat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

      const size = contours.size() as unknown as number
      for (let i = 0; i < size; ++i) {
        let contour = contours.get(i);
        // You can try more different parameters
        let area = cv.contourArea(contour, false);
        console.log(`i ${i}} area ${area}} `)
        if( 10 < area && area < 100 ){
        // if(area > 4000  ){
          let color = new cv.Scalar(255, 0, 0);
          cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
        }
      }
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
