import React, { useRef, useEffect, useState, MouseEvent } from 'react';

interface Point {
  x: number; 
  y: number; 
}

interface Level {
  points: Point[];
}

// Define a single level with points
const level: Level = {
  points: [
    { x: 0.74, y: 0.85 }, 
    { x: 0.45, y: 0.75 },
    { x: 0.68, y: 0.55 },
    { x: 0.38, y: 0.40 },
    { x: 0.70, y: 0.30 },
  ],
};

const MapCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0);

  const mobileWidth = 360;
  const mobileHeight = 640;

  const clickRadius = 30;

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (window.innerWidth <= 768) {
        canvas.width = mobileWidth;
        canvas.height = mobileHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      drawCanvas(); 
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mapImage = new Image();
    mapImage.src = '/src/assets/map.png';
    mapImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

      const pointImage = new Image();
      pointImage.src = '/src/assets/point.png'; 
      pointImage.onload = () => {
        level.points.forEach(point => {
          const scaledPoint = {
            x: point.x * canvas.width,  
            y: point.y * canvas.height, 
          };
          ctx.drawImage(pointImage, scaledPoint.x - 15, scaledPoint.y - 15, 30, 30); 
        });

        const monkeyImage = new Image();
        monkeyImage.src = '/src/assets/monkey.png';
        monkeyImage.onload = () => {
          const currentPoint = level.points[currentPointIndex];
          const scaledCurrentPoint = {
            x: currentPoint.x * canvas.width,
            y: currentPoint.y * canvas.height,
          };
          ctx.drawImage(monkeyImage, scaledCurrentPoint.x - 130, scaledCurrentPoint.y - 130, 160, 160);
        };
      };
    };
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [currentPointIndex]); // Only depend on currentPointIndex

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const closestIndex = findClosestPointIndex(clickX, clickY);

    if (closestIndex !== null) {
      setCurrentPointIndex(closestIndex);
    }
  };

  const findClosestPointIndex = (x: number, y: number) => {
    let closestIndex = null;
    let minDistance = Infinity;

    level.points.forEach((point, index) => {
      const scaledPoint = {
        x: point.x * canvasRef.current!.width,
        y: point.y * canvasRef.current!.height,
      };
      const distance = Math.sqrt((scaledPoint.x - x) ** 2 + (scaledPoint.y - y) ** 2);
      if (distance < minDistance && distance <= clickRadius) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <canvas ref={canvasRef} onClick={handleClick} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapCanvas;
