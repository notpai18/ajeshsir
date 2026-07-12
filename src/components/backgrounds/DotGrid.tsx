import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import './DotGrid.css';

export interface DotProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  resistance?: number;
  returnDuration?: number;
}

export interface PointerState {
  x: number;
  y: number;
  isActive: boolean;
}

interface Dot {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
}

export const DotGrid: React.FC<DotProps> = ({
  dotSize = 4,
  gap = 24,
  baseColor = '#D9C2A2',
  activeColor = '#4A0E1B',
  proximity = 100,
  shockRadius = 200,
  shockStrength = 3,
  resistance = 750,
  returnDuration = 1.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef<PointerState>({ x: -1000, y: -1000, isActive: false });
  const animationRef = useRef<number | null>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const initGrid = useCallback(() => {
    if (!canvasRef.current || !wrapperRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const wrapper = wrapperRef.current;
    const rect = wrapper.getBoundingClientRect();
    
    // Scale for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Apply optimization for mobile (reduce density)
    const isMobile = window.innerWidth < 640;
    const currentGap = isMobile ? gap * 1.5 : gap;
    const currentDotSize = isMobile ? Math.max(2, dotSize - 1) : dotSize;

    const cols = Math.floor(rect.width / currentGap);
    const rows = Math.floor(rect.height / currentGap);

    const offsetX = (rect.width - cols * currentGap) / 2 + currentGap / 2;
    const offsetY = (rect.height - rows * currentGap) / 2 + currentGap / 2;

    const dots: Dot[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = offsetX + j * currentGap;
        const y = offsetY + i * currentGap;
        dots.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          color: baseColor,
        });
      }
    }
    dotsRef.current = dots;

    if (reducedMotion) {
      drawStaticGrid(ctx, rect.width, rect.height, dots, currentDotSize);
    }
  }, [gap, dotSize, baseColor, reducedMotion]);

  const drawStaticGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dots: Dot[],
    currentDotSize: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = baseColor;
    dots.forEach((dot) => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, currentDotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawGrid = useCallback(() => {
    if (!canvasRef.current || reducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We get rect width/height directly from canvas client sizes
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    const isMobile = window.innerWidth < 640;
    const currentDotSize = isMobile ? Math.max(2, dotSize - 1) : dotSize;

    dotsRef.current.forEach((dot) => {
      // Add spring physics for return
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Interaction physics
      if (pointerRef.current.isActive) {
        const dx = pointerRef.current.x - dot.x;
        const dy = pointerRef.current.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proximity) {
          const force = (proximity - dist) / proximity;
          dot.vx -= (dx / dist) * force * 0.5;
          dot.vy -= (dy / dist) * force * 0.5;
        }
      }

      // Spring back to origin
      const dxOrigin = dot.originX - dot.x;
      const dyOrigin = dot.originY - dot.y;
      dot.vx += dxOrigin * (1 / resistance) * 10;
      dot.vy += dyOrigin * (1 / resistance) * 10;

      // Dampening
      dot.vx *= 0.9;
      dot.vy *= 0.9;

      // Interpolate color based on distance to origin
      const distToOrigin = Math.sqrt(dxOrigin * dxOrigin + dyOrigin * dyOrigin);
      const colorRatio = Math.min(distToOrigin / 10, 1);
      
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, currentDotSize / 2, 0, Math.PI * 2);
      
      // Simple color lerp
      if (colorRatio > 0.05) {
        ctx.fillStyle = interpolateColor(baseColor, activeColor, colorRatio);
      } else {
        ctx.fillStyle = baseColor;
      }
      
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(drawGrid);
  }, [dotSize, proximity, resistance, baseColor, activeColor, reducedMotion]);

  // Color interpolation helper
  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    initGrid();
    window.addEventListener('resize', initGrid);
    
    if (!reducedMotion) {
      animationRef.current = requestAnimationFrame(drawGrid);
    }
    
    return () => {
      window.removeEventListener('resize', initGrid);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initGrid, drawGrid, reducedMotion]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || reducedMotion) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      pointerRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        isActive: true
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.isActive = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      dotsRef.current.forEach((dot) => {
        const dx = clickX - dot.x;
        const dy = clickY - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < shockRadius) {
          const force = (shockRadius - dist) / shockRadius;
          const angle = Math.atan2(dy, dx);
          
          // Apply GSAP for the shockwave return if possible, or just add velocity
          const targetX = dot.x - Math.cos(angle) * force * shockStrength * 20;
          const targetY = dot.y - Math.sin(angle) * force * shockStrength * 20;

          // Using GSAP to handle the return animation explicitly as requested
          gsap.killTweensOf(dot);
          dot.x = targetX;
          dot.y = targetY;
          
          gsap.to(dot, {
            x: dot.originX,
            y: dot.originY,
            duration: returnDuration,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerLeave);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [shockRadius, shockStrength, returnDuration, reducedMotion]);

  return (
    <div ref={wrapperRef} className="dot-grid-wrapper">
      <canvas ref={canvasRef} className="dot-grid-canvas" />
    </div>
  );
};

export default DotGrid;
