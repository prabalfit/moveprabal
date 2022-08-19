import { detect } from "./helpers/detectPoints";
import { useEffect, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import { Alert, AlertTitle, Grid, Stack } from "@mui/material";
import { Button } from "@mui/material";
import { formatPoints } from "./helpers/formatPoints";

function App() {
  const [detector, setDetector] = useState<any>();
  const [hipAngle, setHipAngle] = useState<any>("loading...");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet
    );
    setDetector(detector);
    setInterval(() => {
      detectPose(detector);
    }, 500);
  };

  const getAngleBetweenPoints = (point1: any, point2: any, point3: any) => {
    const finalAngle =
      (Math.atan2(point1.y - point2.y, point1.x - point2.x) -
        Math.atan2(point3.y - point2.y, point3.x - point2.x)) *
      (180 / Math.PI);
    return finalAngle > 0 ? finalAngle : 180 + finalAngle;
  };

  const detectPose = async (detector: any) => {
    if (!detector) {
      console.log("detector not set yet");
      return;
    }

    const video: any = document.getElementById("video");
    const points = await detect(video, detector);
    const formattedPoints = formatPoints(points[0].keypoints);
    console.log(formattedPoints);
    if (formattedPoints.left_ankle.score < 0.1) {
      console.log("Ankle not visible in screen");
      setHipAngle("Ankle not visible in screen");
      return;
    }
    const hipAngle = getAngleBetweenPoints(
      formattedPoints.left_knee,
      formattedPoints.left_hip,
      formattedPoints.left_shoulder
    );
    setHipAngle(hipAngle);
  };

  return (
    <Grid container spacing={2}>
      <div></div>
      <Grid item xs={4}>
        <Alert severity="success">Hip Angle: {hipAngle}</Alert>
      </Grid>
      <Grid item xs={8}>
        <video id="video" controls autoPlay={false}>
          <source id="currentVID" src="./leg_raise.mp4" type="video/mp4" />
        </video>
      </Grid>
    </Grid>
  );
}

export default App;
