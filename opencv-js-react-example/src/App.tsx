import "./App.css";
import TestPage from "./opencv/TestPage";
import { CameraCantour } from "./mytest/camera-cantour";
import { RectangleCapture } from "./mytest/rectangle-capture";

function App() {
  return (
    <div className="App">
      {/* <TestPage /> */}
      {/* <CameraCantour /> */}
      <RectangleCapture />
    </div>
  );
}

export default App;
