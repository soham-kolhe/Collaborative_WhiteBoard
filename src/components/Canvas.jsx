import { useEffect, useRef } from "react"

const Canvas = () => {
    const canvasRef = useRef();
    const contextRef = useRef();
    
    useEffect(() => {
        const canvas = canvasRef.current

        const resizeCanvas =() =>{
            const { width,height } = canvas.parentElement.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height; 
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        contextRef.current = context;

        return()=>{
            window.removeEventListener('resize',resizeCanvas);
        };      
    }, []);

    
    
  return (
    <canvas 
    ref={canvasRef} 
    width={400} 
    height={300}
    />
  )
}

export default Canvas;
