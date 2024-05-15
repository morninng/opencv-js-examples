
import React, {useEffect, useRef, useState} from 'react';
import cv, { set, Mat } from "@techstark/opencv-js";

const canvasSize = { w: 360, h: 240 };
const logoSize = { w: 100, h: 100 };


export function NameCard() {

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

            capture()

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


  const capture = () => {
    console.log("capture")
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      // let contourMat = new cv.Mat();
      let colorMat = new cv.Mat();
      let thresholdMat = new cv.Mat();
      let dst = new cv.Mat();
      cv.cvtColor(src, colorMat, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(colorMat, thresholdMat, 0, 255, cv.THRESH_OTSU);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(thresholdMat, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_L1);

      // const i = 0;
      const size = contours.size() as unknown as number;
      for (let i = 0; i < size; i++) {
        // ある程度のサイズ以上の輪郭のみ処理
        const contour = contours.get(i);
        const area = cv.contourArea(contour, false);
        // console.log('area', area)
        if (area > 100) {
          let approx = new cv.Mat();
          // cv.Matは行列で、幅1, 高さ4のものが4頂点に近似できた範囲になる
          cv.approxPolyDP(contours.get(i), approx, 0.01 * cv.arcLength(contour, true), true);
          if (approx.size().width === 1 && approx.size().height === 4) {
            // 四角形に近似できる領域は赤で輪郭線描画
            console.log("red countour")
            cv.drawContours(dst, contours, i, new cv.Scalar(255, 0, 0, 255), 4, cv.LINE_8, hierarchy, 100);
          } else {
            // それ以外の輪郭は緑で描画
            console.log("green countour")
            cv.drawContours(dst, contours, i, new cv.Scalar(0, 255, 0, 255), 1, cv.LINE_8, hierarchy, 100);
          }
          approx.delete();
        }
        else{
          // console.log("area", area)
        }
      }


  const contourApproxPolyDP = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);

      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 100, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      let poly = new cv.MatVector();
      cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
      // approximates each contour to polygon

      const size = contours.size() as unknown as number
      for (let i = 0; i < size; ++i) {
        let tmp = new cv.Mat();
        let cnt = contours.get(i);
        // You can try more different parameters
        cv.approxPolyDP(cnt, tmp, 3, true);
        poly.push_back(tmp);
        cnt.delete(); tmp.delete();
      }
      // draw contours with random Scalar
      for (let i = 0; i < size; ++i) {
        let color = new cv.Scalar(255, 0, 0);
        console.log('drawContours')
        cv.drawContours(dst, poly, i, color, 1, 8, hierarchy, 0);
      }

      if(convertedCanvasRef.current){
        console.log('imshow')
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
