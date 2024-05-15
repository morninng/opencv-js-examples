
import React, {useEffect, useRef, useState} from 'react';
import cv, { set } from "@techstark/opencv-js";

const cameraSize = { w: 360, h: 240 };
const canvasSize = { w: 360, h: 240 };
const resolution = { w: 1080, h: 720 };


export function ImageTrial() {

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
            canvasAnalyze2();
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

  const canvasAnalyze2 = () => {
    console.log("canvasAnalyze2");
    if(canvasRef.current){
      const src =  cv.imread(canvasRef.current);
      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

      const edges = new cv.Mat();
      src.copyTo(edges);

      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, edges);
      }
      src.delete();
      dst.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();

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
