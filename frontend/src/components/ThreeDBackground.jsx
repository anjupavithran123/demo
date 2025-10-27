import React from "react";

export default function ThreeDBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Far blurred gradient */}
      <div
        aria-hidden
        className="absolute -left-24 -top-24 w-[60vw] max-w-[900px] h-[60vh] bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 opacity-30 rounded-full blur-3xl transform-gpu animate-slow-rotate"
      />

      {/* Mid layer blob */}
      <div
        aria-hidden
        className="absolute right-0 top-10 w-[50vw] max-w-[700px] h-[55vh] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-40 rounded-[40%] blur-2xl transform-gpu animate-blob-slow"
      />

      {/* Foreground colorful blob */}
      <div
        aria-hidden
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[80vw] max-w-[1100px] h-[55vh] bg-gradient-to-tl from-pink-400 via-rose-400 to-yellow-300 opacity-35 rounded-[40%] blur-xl transform-gpu animate-blob-fast"
      />

      {/* Subtle vignette */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
