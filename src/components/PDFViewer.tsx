"use client";
import React, { useRef } from "react";

export const PDFViewer = ({ href }: { href: string }) => {
  const iframeRef = useRef(null);
  return (
    <iframe
      ref={iframeRef}
      src={`${href}#toolbar=1&navpanes=1&scrollbar=1`}
      className="w-full h-full rounded-lg shadow-lg bg-white"
      style={{
        minHeight: "500px",
        border: "1px solid #e2e8f0",
      }}
      loading="lazy"
    />
  );
};
