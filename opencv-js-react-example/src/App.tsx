import "./App.css";
import TestPage from "./opencv/TestPage";
import { CameraCantour } from "./mytest/camera-cantour";
import { RectangleCapture } from "./mytest/rectangle-capture";
import { ImageTrial } from "./mytest/image-trial";
import { CoreBasicOperation } from "./mytest/core-basic-operation";
import { ImageProcessing } from "./mytest/image-processing";
import { ImageThresholding2 } from "./mytest/image-processing2";
function App() {
  return (
    <div className="App">
      {/* <TestPage /> */}
      {/* <CameraCantour /> */}
      {/* <RectangleCapture /> */}
      {/* <ImageTrial /> */}
      {/* <CoreBasicOperation /> */}
      {/* <ImageProcessing /> */}
      <ImageThresholding2 />
    </div>
  );
}

export default App;
