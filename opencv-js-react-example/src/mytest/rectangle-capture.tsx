
import React, {useEffect, useRef, useState} from 'react';
import cv from "@techstark/opencv-js";

const cameraSize = { w: 360, h: 240 };
const canvasSize = { w: 360, h: 240 };
const resolution = { w: 1080, h: 720 };


export function RectangleCapture() {

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const convertedCanvasRef = useRef<HTMLCanvasElement>(null)
  // const canvasContextRef = useRef<{context: CanvasRenderingContext2D | null}>({context: null}})
  // const ss = useRef<context: CanvasRenderingContext2D>({context: null}})
  const [context,setContext] = useState<CanvasRenderingContext2D>()

  useEffect(()=>{
    console.log("useEffect");

    if(videoRef.current){
      videoRef.current.id       = 'video';
      videoRef.current.width    = cameraSize.w;
      videoRef.current.height   = cameraSize.h;
      videoRef.current.autoplay = true;
    }



    const media = navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { ideal: resolution.w },
        height: { ideal: resolution.h }
      }
    }).then(function(stream) {
      if(videoRef.current){
        videoRef.current.srcObject = stream;
      }else{
        console.log("videoRef.current is null");
      }
    });

    if(canvasRef.current){
      canvasRef.current.id     = 'canvas';
      canvasRef.current.width  = canvasSize.w;
      canvasRef.current.height = canvasSize.h;
      const aaa = canvasRef.current.getContext('2d');
      if(aaa){
        setInterval(()=>{
          if(videoRef.current){
            aaa.drawImage(videoRef.current, 0, 0, canvasSize.w, canvasSize.h);
            // requestAnimationFrame(_canvasUpdate);
            canvasAnalyze(aaa);
          }
        }, 5000);
      }



      setContext(aaa!)
    }else{
      console.log("canvasRef.current is null");
    }

    if(convertedCanvasRef.current)  {
      convertedCanvasRef.current.width  = canvasSize.w;
      convertedCanvasRef.current.height = canvasSize.h;
    }else{
      console.log("convertedCanvasRef.current is null");
    }



    _canvasUpdate();

    // setTimeout(()=>{
    //   canvasAnalyze();
    // }, 1000);
  }, [])

  const _canvasUpdate = () => {
    if(context && videoRef.current){
      // console.log("_canvasUpdate");

    }else{
      // console.log("context is null");
    }
  };

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

      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();

      cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_L1);
      console.log("contours", contours);
      // for (let i = 0; i < contours.size(); i++) {
      //   // ある程度のサイズ以上の輪郭のみ処理
      //   const area = cv.contourArea(contours.get(i), false);
      //   if (area > 15000) {
      //     let approx = new cv.Mat();
      //     // cv.Matは行列で、幅1, 高さ4のものが4頂点に近似できた範囲になる
      //     cv.approxPolyDP(contours.get(i), approx, 0.01 * cv.arcLength(contours.get(i), true), true);
      //     if (approx.size().width === 1 && approx.size().height === 4) {
      //       // 四角形に近似できる領域は赤で輪郭線描画
      //       cv.drawContours(src, contours, i, new cv.Scalar(255, 0, 0, 255), 4, cv.LINE_8, hierarchy, 100);
      //     } else {
      //       // それ以外の輪郭は緑で描画
      //       cv.drawContours(src, contours, i, new cv.Scalar(0, 255, 0, 255), 1, cv.LINE_8, hierarchy, 100);
      //     }
      //     approx.delete();
      //   }
      // }


      if(convertedCanvasRef.current){
        cv.imshow(convertedCanvasRef.current, edges);
      }
      src.delete();
      imgGray.delete();
      edges.delete();
      // cv.cvtColor(src, imgGray, cv.COLOR_BGR2GRAY);
      // cv.imshow(this.grayImgRef.current, imgGray);

      // detect edges using Canny
      // const edges = new cv.Mat();
      // cv.Canny(imgGray, edges, 100, 100);
      // cv.imshow(this.cannyEdgeRef.current, edges);

      // // detect faces using Haar-cascade Detection
      // const haarFaces = detectHaarFace(img);
      // cv.imshow(this.haarFaceImgRef.current, haarFaces);


    }

  }


  return (
    <div>
      video from
      <video ref={videoRef}></video>
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
