/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomScale?: number; // কত গুণ জুম হবে (Defualt: 2.5x)
  lensSize?: number;  // গোল লেন্সের সাইজ পিক্সেলে (Default: 140px)
}

export default function ImageZoom({
  src,
  alt,
  zoomScale = 2.5,
  lensSize = 140,
}: ImageZoomProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    // কন্টেইনারের সাপেক্ষে মাউসের অবস্থান
    let x = e.clientX - left;
    let y = e.clientY - top;

    // লেন্স যাতে বাউন্ডারির বাইরে না যায়
    const halfLens = lensSize / 2;
    if (x < halfLens) x = halfLens;
    if (x > width - halfLens) x = width - halfLens;
    if (y < halfLens) y = halfLens;
    if (y > height - halfLens) y = height - halfLens;

    // লেন্সের কেন্দ্র পজিশন
    setLensPosition({
      x: x - halfLens,
      y: y - halfLens,
    });

    // ব্যাকগ্রাউন্ড ইমেজের জুম অফসেট হিসাব
    const bgX = ((x) / width) * 100;
    const bgY = ((y) / height) * 100;

    setBgPosition({ x: bgX, y: bgY });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full cursor-crosshair overflow-hidden select-none"
    >
      {/* মূল ছবি */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* সার্কেল জুম লেন্স (Circle Zoom Magnifier Lens) */}
      {showZoom && (
        <div
          className="absolute rounded-full border-2 border-white/80 shadow-2xl pointer-events-none z-30 overflow-hidden"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            top: `${lensPosition.y}px`,
            left: `${lensPosition.x}px`,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
            boxShadow: "0 0 15px rgba(0,0,0,0.35), inset 0 0 10px rgba(0,0,0,0.25)",
          }}
        />
      )}
    </div>
  );
}