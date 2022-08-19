export const detect = async (video: any, detector: any) => {
  if (!video) {
    return;
  }

  return await detector.estimatePoses(video);
};
