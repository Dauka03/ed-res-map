import React, { useRef, useEffect, useState, MouseEvent } from 'react';

// Определим интерфейс для координатных точек
interface Point {
  x: number;
  y: number;
}

const MapCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Point>({ x: 50, y: 50 });
  const points: Point[] = [
    { x: 50, y: 50 },
    { x: 100, y: 100 },
    { x: 150, y: 150 },
    // добавьте остальные точки
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Функция для рендеринга карты и точек
    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рендерим дорожку
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // Рендерим точки
      ctx.fillStyle = 'red';
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Рендерим фигурку
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(currentPosition.x, currentPosition.y, 10, 0, 2 * Math.PI);
      ctx.fill();
    };

    drawMap();
  }, [currentPosition]);

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Находим ближайшую точку и перемещаем фигурку
    const closestPoint = points.reduce((prev, curr) =>
      Math.hypot(curr.x - clickX, curr.y - clickY) < Math.hypot(prev.x - clickX, prev.y - clickY) ? curr : prev
    );
    setCurrentPosition({ x: closestPoint.x, y: closestPoint.y });
  };

  return <canvas ref={canvasRef} onClick={handleClick} width={300} height={300} />;
};

export default MapCanvas;
