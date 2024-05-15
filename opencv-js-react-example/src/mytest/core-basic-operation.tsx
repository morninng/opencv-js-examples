
import React, {useEffect, useRef, useState} from 'react';
import cv, { set, Mat } from "@techstark/opencv-js";

const canvasSize = { w: 360, h: 240 };
const logoSize = { w: 100, h: 100 };


export function CoreBasicOperation() {

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
          // canvasAnalyze(context);
          setTimeout(()=>{
            showMatInfo();
            // copyMat()
            // convertMat()
            // executeMatVector()
            // roi()
            // splitAndMergeImageChannels()
            // paddingImage()
            // imageAddition()
            // imageBitwise()
            // cvtColor()
            // transform()
            threshold()
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

  const cvtColor = () => {

    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);


      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, dst);
      }
    }
  }

  // この例でいうと、THRESHOLD_CRITERIA に 100を指定しているが、
  // そこで指定した値が何かが大きなポイント。
  // 初期に、レシートのメインになる領域の色を調べて、それ以外の色のところを真っ黒にしてしまうなどをすれば関係ない部分をはじける
  // レシートには影が入ることもあると思うのでopacityのところは変わる。だが、基本的な色味は変わらないはずなので、
  // 色味が違うところをまず弾くというのがいいかもしれない。
  // レシートの色、レシートの影部分の色というのに、どういうRGBの傾向があるかを調べる。
  // 中央の領域で、黒いような部分を削除し、その中央値にあるような場所を基本の色としたあとに、
  // grayにしたら白っぽい（つまり影ではないところ）を基本の色として考えるのがいいかなと。
  // vectorにしてそれぞれの色を別々にしたもので、gray化けるしたら、その色のなかでの傾向がわかるはず。
  const threshold = () => {

    if(canvasRef.current){
      const src: Mat =  cv.imread(canvasRef.current);
      let dst = new cv.Mat();
      let grayedMat = new cv.Mat();
      let thresholdMat = new cv.Mat();
      let maskInv = new cv.Mat();
      let roi = new cv.Mat();
      let imgBg = new cv.Mat();

      const THRESHOLD_CRITERIA = 100;

      // 画像をカラーからグレースケールに変換
      // cv.COLOR_RGBA2GRAYは、RGBA（赤、緑、青、アルファ）カラースペースからグレースケールへの変換を示す定数
      cv.cvtColor(src, grayedMat, cv.COLOR_RGBA2GRAY, 0);

      // 指定したしきい値（ここでは100）を超えるピクセル値を255に設定し、
      // それ未満のピクセル値を0に設定します。この操作により、ロゴの形状が白い領域（255）として強調され、
      // 背景は黒い領域（0）として抽出されます
      cv.threshold(grayedMat, thresholdMat,THRESHOLD_CRITERIA, 255, cv.THRESH_BINARY);
      // cv.bitwise_not(thresholdMat, maskInv);
      // cv.bitwise_and(roi, roi, imgBg, maskInv);
      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, thresholdMat);
      }
    }
  }

  // ここまだできてない。
  // http://opencv.jp/opencv-2.1/cpp/geometric_image_transformations.html
  // const transform = () => {

  //   if(canvasRef.current){
  //     const src: Mat =  cv.imread(canvasRef.current);
  //     let dst = new cv.Mat();
  //     const customMatrix = [
  //       0.2989, 0.5870, 0.1140, 0, 0,
  //       0.2989, 0.5870, 0.1140, 0, 0,
  //       0.2989, 0.5870, 0.1140, 0, 0,
  //       0, 0, 0, 1, 0
  //     ];
  //     const customMatrix2 = new cv.Mat(customMatrix, new cv.Size(3, 3), cv.CV_32F)
  //     // const customMatrix2 = new cv.Mat(customMatrix, new cv.Size(4, 4), cv.CV_32F);

  //     cv.transform(src, dst, customMatrix2);
  //     if(convertedCanvasRef.current){
  //       cv.imshow(convertedCanvasRef.current, dst);
  //     }
  //   }
  // }



  const imageBitwise = () => {
    if(canvasRef.current && logoCanvasRef.current){

      let src = cv.imread(canvasRef.current);
      let logo = cv.imread(logoCanvasRef.current);
      // Matオブジェクトは、行列形式で画像データを保持するためのもので、後で各種操作に使用されます。
      let dst = new cv.Mat();
      let roi = new cv.Mat();
      let mask = new cv.Mat();
      let maskInv = new cv.Mat();
      let imgBg = new cv.Mat();
      let imgFg = new cv.Mat();
      let sum = new cv.Mat();
      let rect = new cv.Rect(0, 0, logo.cols, logo.rows);

      // I want to put logo on top-left corner, So I create a ROI
      roi = src.roi(rect);

      // Create a mask of logo and create its inverse mask also
      cv.cvtColor(logo, mask, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(mask, mask, 100, 255, cv.THRESH_BINARY);
      cv.bitwise_not(mask, maskInv);

      // Black-out the area of logo in ROI
      cv.bitwise_and(roi, roi, imgBg, maskInv);

      // Take only region of logo from logo image
      cv.bitwise_and(logo, logo, imgFg, mask);

      // Put logo in ROI and modify the main image
      cv.add(imgBg, imgFg, sum);

      dst = src.clone();
      for (let i = 0; i < logo.rows; i++) {
          for (let j = 0; j < logo.cols; j++) {
              dst.ucharPtr(i, j)[0] = sum.ucharPtr(i, j)[0];
          }
      }
      if(convertedCanvasRef.current){
      cv.imshow(convertedCanvasRef.current, dst);
      }
      src.delete(); dst.delete(); logo.delete(); roi.delete(); mask.delete();
      maskInv.delete(); imgBg.delete(); imgFg.delete(); sum.delete();
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
