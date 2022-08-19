export const formatPoints = (points: any) => {
  const newPoints: any = {};
  for (var i = 0; i < points.length; i++) {
    const point = points[i];
    newPoints[point.name] = { x: point.x, y: point.y, score: point.score };
  }
  return newPoints;
};
