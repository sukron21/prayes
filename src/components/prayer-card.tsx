"use client";

import { Clock } from "lucide-react";
import { getRemainingTimeFromString } from "../utils/times";
import { useEffect, useState } from "react";

// import { Clock } from 'lucide-react';

interface PrayerCardProps {
  name: string;
  arabicName: string;
  time: string;
  isActive: boolean;
  isNext: boolean;
  dataNextTimes: string;
}

export function PrayerCard({
  name,
  arabicName,
  time,
  isActive,
  isNext,
  dataNextTimes,
}: PrayerCardProps) {
  const [dataTime, setDataNextTimes] = useState(dataNextTimes);

  useEffect(() => {
    if (!isNext) return;

    const interval = setInterval(() => {
      const nextTime = getRemainingTimeFromString(time); // hitung sisa waktu
      // ubah ke string format hh:mm:ss
      const formatted = `${String(nextTime.hours).padStart(2, "0")} : ${String(nextTime.minutes).padStart(2, "0")} : ${String(nextTime.seconds).padStart(2, "0")}`;
      setDataNextTimes(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isNext]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-blue-300 text-primary-foreground shadow-lg ring-2 ring-primary/30 animate-pulse"
          : isNext
            ? "bg-accent text-accent-foreground shadow-md"
            : "bg-card text-card-foreground border border-border shadow-sm hover:shadow-md hover:border-primary/20"
      }`}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider opacity-75">
              {name}
            </p>
            <h3 className="text-xl font-semibold">{arabicName}</h3>
          </div>
          {/* {isActive && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/15 rounded-full text-xs font-semibold whitespace-nowrap">
              <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
              Sekarang
            </div>
          )} */}
          {isNext && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/15 rounded-full text-xs font-semibold whitespace-nowrap">
              {/* <Clock className="h-3 w-3" /> */}
              Berikutnya
            </div>
          )}
        </div>

        <div
          className={`flex items-baseline gap-2 pt-2 ${
            isActive || isNext ? "" : "border-t border-border"
          }`}
        >
          <Clock
            className={`h-4 w-4 ${isActive || isNext ? "opacity-90" : "text-primary opacity-60"}`}
          />
          <span className="text-3xl font-bold tabular-nums">{time}</span>
          <span className="text-sm font-medium opacity-60">WIB</span>
          {isNext && <div className="ml-auto">{dataTime}</div>}
        </div>
      </div>

      {isActive && (
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
        </div>
      )}
    </div>
  );
}
