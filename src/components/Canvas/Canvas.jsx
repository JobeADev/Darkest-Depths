import useCanvas from "./useCanvas";

const Canvas = ({ image, ...otherProps }) => {
  const canvasRef = useCanvas(image);

  return <canvas width={160} height={160} ref={canvasRef} {...otherProps} />;
};

export default Canvas;
