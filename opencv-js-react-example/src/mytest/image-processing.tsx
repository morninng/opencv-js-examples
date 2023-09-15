
import React, {useEffect, useRef, useState} from 'react';
import cv, { set, Mat } from "@techstark/opencv-js";

const canvasSize = { w: 360, h: 240 };
const logoSize = { w: 100, h: 100 };


export function ImageProcessing() {

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

            // convertColor()
            inRangeColor()

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


  const convertColor = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // この
      let dst = src.clone();
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }

  const inRangeColor = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // この
      const dst = new Mat();
      let low = new cv.Mat(src.rows, src.cols, src.type(), [130, 0, 0, 0]);
      let high = new cv.Mat(src.rows, src.cols, src.type(), [255, 150, 150, 255]); // 赤っぽい色

      cv.inRange(src, low, high, dst);
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
