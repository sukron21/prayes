"use client";

import { PrayerCard } from "./prayer-card";

export interface Prayer {
  name: string;
  arabicName: string;
  time: string;
}

interface PrayerGridProps {
  prayers: Prayer[];
  currentPrayer?: number;
  nextPrayer?: number;
  dataNextTimes?: string;
}

export function PrayerGrid({
  prayers,
  currentPrayer = -1,
  nextPrayer = 0,
  dataNextTimes = "00:00",
}: PrayerGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {prayers.map((prayer, index) => (
        <PrayerCard
          key={index}
          name={prayer.name}
          arabicName={prayer.arabicName}
          time={prayer.time}
          isActive={index - 1 === currentPrayer}
          isNext={index === nextPrayer}
          dataNextTimes={dataNextTimes}
        />
      ))}
    </div>
  );
}
