import "./App.css";
import TestPage from "./opencv/TestPage";
import { CameraCantour } from "./mytest/camera-cantour";
import { RectangleCapture } from "./mytest/rectangle-capture";
import { ImageTrial } from "./mytest/image-trial";

function App() {
  return (
    <div className="App">
      {/* <TestPage /> */}
      {/* <CameraCantour /> */}
      {/* <RectangleCapture /> */}
      <ImageTrial />
    </div>
  );
}

export default App;
