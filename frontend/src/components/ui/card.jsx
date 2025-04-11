import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-lg bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  );
}
