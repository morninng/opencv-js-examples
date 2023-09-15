
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

        img.src = './english.jpg';
        img.onload = function onImageLoad() {
          context.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
          // canvasAnalyze(context);
          setTimeout(()=>{
            showMatInfo();
            // copyMat()
            // convertMat()
            // executeMatVector()
            // roi()
            // splitAndMergeImageChannels()
            // paddingImage()
            imageAddition()
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

      console.log('image rows: ', src.rows)
      console.log('image cols: ', src.cols)
      // console.log('src.depth ', src.depth())
      // console.log('src.size() ', src.size())
      // console.log('src.size().width ', src.size().width)
      // console.log('src.size().height ', src.size().height)
      // console.log('src.channels() ', src.channels())
      // console.log('src.type() ', src.type())
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


  const executeMatVector = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // この

      // Initialise a MatVector
      let matVec = new cv.MatVector();

      // MatVector オブジェクトである matVec に src のコピーを追加します。つまり、src に格納されている画像データのコピーが matVec 内に追加される
      matVec.push_back(src);
      // Get a Mat fom MatVector
      let cnt = matVec.get(0);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, cnt);
      }
      src.delete(); matVec.delete(); cnt.delete();
    }
  }


  const acceessAndModifyPixelValue = () => {
    let row = 90, col = 90;
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // この

      if (src.isContinuous()) {
        let R = src.data[row * src.cols * src.channels() + col * src.channels()];
        let G = src.data[row * src.cols * src.channels() + col * src.channels() + 1];
        let B = src.data[row * src.cols * src.channels() + col * src.channels() + 2];
        let A = src.data[row * src.cols * src.channels() + col * src.channels() + 3];
        console.log(`RGBA(${row}, ${col}) = ( ${R}, ${G}, ${B}, ${A})`);
      }
      if(true){
        let dst = src.clone();
        let pixel = dst.ucharPtr(row, col);
        let R = pixel[0];
        let G = pixel[1];
        let B = pixel[2];
        let A = pixel[3];
        console.log(`RGBA(${row}, ${col}) = ( ${R}, ${G}, ${B}, ${A})`);
        pixel[0] = 255
        pixel[1] = 0
        pixel[2] = 255
        pixel[3] = 255
        if(convertedCanvasRef.current){
          cv.imshow(convertedCanvasRef.current, dst);  // 値を変更したものが描画されている
        }
      }

    }
  }

  const roi = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      // You can try more different parameters
      let rect = new cv.Rect(200, 50, 100, 100);
      dst = src.roi(rect);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);  // 値を変更したものが描画されている
      }
    }
  }


  // https://tomomai.com/python-opencv-split-numpy-concatenate/
  const splitAndMergeImageChannels = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let rgbaPlanes = new cv.MatVector();
      cv.split(src, rgbaPlanes);
      let R = rgbaPlanes.get(0);
      let nonR = cv.Mat.zeros(R.rows, R.cols, R.type());
      let G = rgbaPlanes.get(1);
      let B = rgbaPlanes.get(2);
      let A = rgbaPlanes.get(3);
      let matVec = new cv.MatVector();
      // matVec.push_back(R)
      // const blank = new cv.Mat();
      matVec.push_back(nonR)
      matVec.push_back(G)
      matVec.push_back(B)
      let dst = new cv.Mat();
      cv.merge(matVec, dst);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
      src.delete(); rgbaPlanes.delete();

    }
  }

  const paddingImage = () => {

    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      let s = new cv.Scalar(255, 0, 0, 255);
      cv.copyMakeBorder(src, dst, 10, 10, 10, 10, cv.BORDER_CONSTANT, s);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
      src.delete();
      dst.delete();
    }
  }

  const imageAddition = () => {
    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current); // 本当は二つの別の画像をやりたいがないので代用
      let dst = new cv.Mat();
      let mask = new cv.Mat();
      let dtype = -1;  // dtypeはデータ型を指定する変数で、このコードでは-1としています。-1を指定すると、出力画像のデータ型が入力画像のデータ型と同じ
      cv.add(src, src, dst, mask, dtype); // src1とsrc2の画像を加算し、結果をdstに格納します。maskとdtypeは省略可能なパラメータで、マスク画像とデータ型を指定するために使用されます
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


    </div>
  )
}
