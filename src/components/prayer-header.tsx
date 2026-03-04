"use client";

import { MapPin, Calendar } from "lucide-react";
import { SearchableDropdown } from "./dropdown";

type Option = { id: string; lokasi: string };
interface PrayerHeaderProps {
  location?: Option[];
  date: string;
  hijriDate: string;
  setId: (id: string) => void;
}

export function PrayerHeader({
  location = [],
  date,
  hijriDate,
  setId,
}: PrayerHeaderProps) {
  return (
    <div className="mb-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-balance tracking-tight">
          Jadwal Sholat
        </h1>
        <p className="text-base text-muted-foreground">
          Waktu sholat untuk hari ini di lokasi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="relative flex  items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-center min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Lokasi
            </p>
            {/* <p className="font-semibold text-foreground truncate">{location}</p> */}
            <SearchableDropdown
              options={location ?? []}
              placeholder="Select Daerah..."
              onSelect={(option) => setId(option.id)}
            />
          </div>
        </div>

        <div className="relative flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-center min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tanggal
            </p>
            <p className="font-semibold text-foreground truncate text-sm">
              {date}
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-center min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Hijri
            </p>
            <p className="font-semibold text-foreground truncate text-sm">
              {hijriDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
