import { useRef, useEffect } from "react";
import Knight from "./Knight-Final-row.png";

const useCanvas = (image) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;

    const spriteImage = new Image();
    spriteImage.src = image === "Knight" ? Knight : null;
    let frames = 0;
    let frameX = 0;
    let frameY = 0;
    let animationId;
    const staggerFrames = 14.2;

    const animate = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      let position = Math.floor(frames / staggerFrames) % 6;
      frameX = CANVAS_WIDTH * position;
      // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
      ctx.drawImage(
        spriteImage,
        frameX,
        frameY * CANVAS_HEIGHT,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
      );
      frames++;
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => window.cancelAnimationFrame(animationId);
  }, [image]);

  return canvasRef;
};

export default useCanvas;

// draw(ctx, frames);
// ctx.canvas.width, ctx.canvas.height
