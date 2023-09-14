
import React, {useEffect, useRef, useState} from 'react';
import cv, { set, Mat } from "@techstark/opencv-js";

const canvasSize = { w: 360, h: 240 };


export function CoreBasicOperation() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const convertedCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    console.log("useEffect");


    if(canvasRef.current){
      canvasRef.current.id     = 'canvas';
      canvasRef.current.width  = canvasSize.w;
      canvasRef.current.height = canvasSize.h;
      const context = canvasRef.current.getContext('2d');
      if(context){
        var img = new Image();

        img.src = './receipt2.png';
        img.onload = function onImageLoad() {
          context.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
          // canvasAnalyze(context);
          setTimeout(()=>{
            // showMatInfo();
            // copyMat()
            convertMat()
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

  const showMatInfo = () => {
    console.log("canvasAnalyze2");
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // この
      console.log('image width: ', src.cols)
      console.log('src.depth ', src.depth())
      console.log('src.size() ', src.size())
      console.log('src.size().width ', src.size().width)
      console.log('src.size().height ', src.size().height)
      console.log('src.channels() ', src.channels())
      console.log('src.type() ', src.type())
    }
  }
  const copyMat = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // この
      let dst = src.clone();
      const mask = new cv.Mat();
      src.copyTo(dst, mask);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }


  const convertMat = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // この
      let dst = src.clone();
      src.convertTo(dst, 1);
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
    converted
      <canvas  ref={convertedCanvasRef} />


    </div>
  )
}
