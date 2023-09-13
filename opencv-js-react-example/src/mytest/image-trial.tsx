
import React, {useEffect, useRef, useState} from 'react';
import cv from "@techstark/opencv-js";

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
          canvasAnalyze(context);
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



  const canvasAnalyze = (context: CanvasRenderingContext2D) => {
    console.log("canvasAnalyze");
    if(context){
      console.log("sss");
      let imgData = context.getImageData(0, 0, canvasSize.w, canvasSize.h);
      let src = cv.matFromImageData(imgData);

      const imgGray = new cv.Mat();
      cv.cvtColor(src, imgGray, cv.COLOR_BGR2GRAY);
      const edges = new cv.Mat();
      cv.Canny(imgGray, edges, 50, 150);

      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, edges);
      }
      src.delete();
      imgGray.delete();
      edges.delete();


    }

  }


  return (
    <div>
      eee
    <br />
      <canvas  ref={canvasRef} />
    <br />
    jj
      <canvas  ref={convertedCanvasRef} />
      kk

    </div>
  )
}
