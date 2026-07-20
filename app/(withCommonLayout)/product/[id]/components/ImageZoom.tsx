/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomScale?: number; // কত গুণ জুম হবে
  lensSize?: number;  // সার্কেল লেন্সের সাইজ
}

export default function ImageZoom({
  src,
  alt,
  zoomScale = 3.5, // জুম অনেক বাড়ানো হলো (3.5x)
  lensSize = 400,  // সার্কেল লেন্স বড় করা হলো (200px)
}: ImageZoomProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // কন্টেইনারের সাপেক্ষে মাউসের সঠিক এক্সিস পজিশন
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // লেন্স যাতে ফ্রেমের ভেতরে সুন্দরভাবে মুভ করে
    const halfLens = lensSize / 2;

    setLensPosition({
      x: x - halfLens,
      y: y - halfLens,
    });

    // পার্সেন্টেজ হিসাব
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setBgPosition({ x: bgX, y: bgY });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full cursor-crosshair overflow-hidden select-none"
      style={{ touchAction: "none" }}
    >
      {/* মূল ছবি */}
      <img
        src={src || "/placeholder.png"}
        alt={alt}
        className="w-full h-full object-cover block pointer-events-none"
      />

      {/* বড় সার্কেল জুম লেন্স (Circle Zoom Magnifier) */}
      {showZoom && src && (
        <div
          className="absolute rounded-full border-2 border-white/90 pointer-events-none z-50 overflow-hidden"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            top: `${lensPosition.y}px`,
            left: `${lensPosition.x}px`,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.3)",
          }}
        />
      )}
    </div>
  );
}