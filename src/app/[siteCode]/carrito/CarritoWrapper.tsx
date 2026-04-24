"use client";
import dynamic from "next/dynamic";

const CarritoContent = dynamic(() => import("./CarritoContent"), { ssr: false });

export default function CarritoWrapper() {
  return <CarritoContent />;
}
