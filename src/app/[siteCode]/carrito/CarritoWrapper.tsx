"use client";
import dynamic from "next/dynamic";
import type { PackDestacado } from "@/types";

const CarritoContent = dynamic(() => import("./CarritoContent"), { ssr: false });

interface Props {
  initialPacks: PackDestacado[];
}

export default function CarritoWrapper({ initialPacks }: Props) {
  return <CarritoContent initialPacks={initialPacks} />;
}
