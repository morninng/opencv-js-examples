
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
            // inRangeColor()
            // resizeImage()
            // affineTransition()
            // affineTransitionRotate()
            affineTransform()

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

  const resizeImage = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      const dst = new Mat();
      const dsize = new cv.Size(100, 100);
      cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }

  const affineTransition = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, 50, 0, 1, 100]);
      let dsize = new cv.Size(src.cols, src.rows );
      // You can try more different parameters
      cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
      src.delete(); dst.delete(); M.delete();
    }
  }
  const affineTransitionRotate = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      // let dsize = new cv.Size(src.rows, src.cols);
      let dsize = new cv.Size(src.cols, src.rows );
      let center = new cv.Point(src.cols / 2, src.rows / 2);
      // You can try more different parameters
      let M = cv.getRotationMatrix2D(center, 45, 1);
      cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
      src.delete(); dst.delete(); M.delete();
    }
  }


  const affineTransform = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      let srcTri = cv.matFromArray(3, 1, cv.CV_32FC2, [0, 0, 0, 1, 1, 0]);
      let dstTri = cv.matFromArray(3, 1, cv.CV_32FC2, [0.6, 0.2, 0.1, 1.3, 1.5, 0.3]);
      let dsize = new cv.Size(src.rows, src.cols);
      let M = cv.getAffineTransform(srcTri, dstTri) // 変換前と変換後の三角形の頂点座標からアフィン変換の変換行列を計算します
      cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar()); // アフィン変換を適用
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
      src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();
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
