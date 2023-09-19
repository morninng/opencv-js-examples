
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
        // img.src = './meishi.jpeg';
        // img.src = './english.jpg';
        img.onload = function onImageLoad() {
          context.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
          setTimeout(()=>{
            // contourGettingStarted()
            // contourMoment()
            // contourArea()
            // contourPerimeter()
            // contourApproxPolyDP()
            // contourConvertHull()
            // contourBoundingRect()
            // contourCircle()
            contourFitLine()

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
        if( 400 < area && area < 1000 ){
        // if(area > 4000  ){
          let color = new cv.Scalar(255, 0, 0);

          let perimeter = cv.arcLength(contour, true);
          let boundingRect = cv.boundingRect(contour);
          console.log("perimeter", perimeter)
          console.log("boundingRect", boundingRect)
          cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
        }
      }
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
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
        cv.drawContours(dst, poly, i, color, 1, 8, hierarchy, 0);
      }

      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }


  // このhullも利用dきそう
  const contourConvertHull = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);

      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 100, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      let hull = new cv.MatVector();
      cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
      // approximates each contour to convex hull
      const size = contours.size() as unknown as number
      for (let i = 0; i < size; ++i) {
          let tmp = new cv.Mat();
          let cnt = contours.get(i);
          // You can try more different parameters
          cv.convexHull(cnt, tmp, false, true);
          hull.push_back(tmp);
          cnt.delete(); tmp.delete();
      }
      // draw contours with random Scalar
      for (let i = 0; i < size; ++i) {
        let color = new cv.Scalar(255, 0, 0);
          cv.drawContours(dst, hull, i, color, 1, 8, hierarchy, 0);
      }

      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }


  const contourCircle = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);


      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
      const size = contours.size() as unknown as number
      for (let i = 0; i < size; ++i) {
        let contour = contours.get(i);
        // You can try more different parameters
        let area = cv.contourArea(contour, false);
        console.log(`i ${i}} area ${area}} `)
        if( 400 < area && area < 1000 ){
          console.log('ssssssss')

      // @ts-ignore
      let circle = cv.minEnclosingCircle(contour);
      let contoursColor = new cv.Scalar(0, 255, 0);
      let circleColor = new cv.Scalar(255, 0, 0);
      cv.drawContours(dst, contours, i, contoursColor, 1, 8, hierarchy, 100);
      // @ts-ignore
      cv.circle(dst, circle.center, circle.radius, circleColor);
        }
      }

      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }


  const contourBoundingRect = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);

      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

      const size = contours.size() as unknown as number
      for (let i = 0; i < size; ++i) {
        let contour = contours.get(i);
        // You can try more different parameters
        let area = cv.contourArea(contour, false);
        console.log(`i ${i}} area ${area}} `)
        if( 400 < area && area < 1000 ){

          // @ts-ignore
          let rect = cv.boundingRect(contour);
          let contoursColor = new cv.Scalar(0, 255, 0);
          let rectangleColor = new cv.Scalar(255, 0, 0);
          let point1 = new cv.Point(rect.x, rect.y);
          let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
          cv.drawContours(dst, contours, i, contoursColor, 1, 8, hierarchy, 100);
        }
      }

      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }


  const contourFitLine = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);



let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
let contours = new cv.MatVector();
let hierarchy = new cv.Mat();
let line = new cv.Mat();
cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

const size = contours.size() as unknown as number
for (let i = 0; i < size; ++i) {
  let contour = contours.get(i);
  // You can try more different parameters
  let area = cv.contourArea(contour, false);
  console.log(`i ${i}} area ${area}} `)
  if( 400 < area && area < 1000 ){


// You can try more different parameters
cv.fitLine(contour, line, cv.DIST_L2, 0, 0.01, 0.01);
let contoursColor = new cv.Scalar(0, 255, 0);
let lineColor = new cv.Scalar(255, 0, 0);
cv.drawContours(dst, contours, i, contoursColor, 1, 8, hierarchy, 100);
let vx = line.data32F[0];
let vy = line.data32F[1];
let x = line.data32F[2];
let y = line.data32F[3];
let lefty = Math.round((-x * vy / vx) + y);
let righty = Math.round(((src.cols - x) * vy / vx) + y);
let point1 = new cv.Point(src.cols - 1, righty);
let point2 = new cv.Point(0, lefty);
cv.line(dst, point1, point2, lineColor, 2, cv.LINE_AA, 0);
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
