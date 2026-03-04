"use client";

import { useEffect, useState } from "react";
import { PrayerGrid, type Prayer } from "../../components/prayer-grid";
import { PrayerHeader } from "../../components/prayer-header";
import { getRemainingTimeFromString } from "../../utils/times";
import { useSholat } from "../../api/daerah";
import { useJadwalSholat } from "../../api/jadwal-sholat";
// import { PrayerHeader } from '@/components/prayer-header';

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState<number>(-1);
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
  const [id, setId] = useState<string>("58a2fc6ed39fd083f55d4182bf88826d");
  const { data } = useSholat();
  const { data: dataSholat } = useJadwalSholat(id);
  let prayerTimes: Prayer[] = [];

  if (dataSholat?.data?.jadwal) {
    // TypeScript sekarang tahu jadwal bukan undefined
    const dateKeys = Object.keys(dataSholat.data.jadwal);
    const firstDate = dateKeys[0];

    const jadwalHariIni = (dataSholat.data.jadwal as Record<string, any>)[
      firstDate
    ];

    prayerTimes = [
      { name: "Subuh", arabicName: "الفجر", time: jadwalHariIni.subuh },
      { name: "Dzuhur", arabicName: "الظهر", time: jadwalHariIni.dzuhur },
      { name: "Ashar", arabicName: "العصر", time: jadwalHariIni.ashar },
      { name: "Maghrib", arabicName: "المغرب", time: jadwalHariIni.maghrib },
      { name: "Isya", arabicName: "العشاء", time: jadwalHariIni.isya },
    ];
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      // Determine current and next prayer
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      let current = -1;
      let next = 0;

      for (let i = 0; i < prayerTimes.length; i++) {
        const [h, m] = prayerTimes[i].time.split(":").map(Number);
        const prayerTimeInMinutes = h * 60 + m;

        if (
          prayerTimeInMinutes <= currentTimeInMinutes &&
          (i === prayerTimes.length - 1 ||
            parseInt(prayerTimes[i + 1].time.split(":")[0]) * 60 +
              parseInt(prayerTimes[i + 1].time.split(":")[1]) >
              currentTimeInMinutes)
        ) {
          current = i;
          next = i + 1 < prayerTimes.length ? i + 1 : 0;
        }
      }

      setCurrentPrayerIndex(current);
      setNextPrayerIndex(next);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", dateOptions);

  // Simplified Hijri date calculation (simplified version)

  const hijriDate = new Intl.DateTimeFormat("id-TN-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  const hijriDateString = hijriDate;
  const dataNextTimes = getRemainingTimeFromString(
    prayerTimes[nextPrayerIndex].time,
  );
  console.log("data", dataSholat);

  return (
    <main className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative">
        <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
          <PrayerHeader
            location={data?.data}
            date={formattedDate}
            hijriDate={hijriDateString}
            setId={setId}
          />

          {currentTime && (
            <div className="mb-10 p-8 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-lg border border-primary/20">
              <p className="text-sm font-medium uppercase tracking-wide opacity-85 mb-3">
                Waktu Saat Ini
              </p>
              {/* <div className="flex items-center gap-3"> */}
              <p className="text-6xl md:text-7xl font-bold tabular-nums">
                {currentTime}
              </p>
              <div className="flex h-3 w-3 rounded-full bg-white/40 animate-pulse" />
              {/* </div> */}
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Jadwal Sholat Hari Ini
            </h2>
            <PrayerGrid
              prayers={prayerTimes}
              currentPrayer={currentPrayerIndex}
              nextPrayer={nextPrayerIndex}
              dataNextTimes={`${dataNextTimes.hours}:${dataNextTimes.minutes}:${dataNextTimes.seconds}`}
            />
          </div>

          <div className="mt-12 p-6 rounded-xl bg-secondary/10 border border-secondary/20">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4">
              Informasi Penting
            </h2>
            <ul className="space-y-2.5 text-sm text-foreground/75">
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Waktu sholat di atas merupakan contoh data</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>
                  Gunakan API resmi dari Kemenag RI untuk data akurat sesuai
                  lokasi
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>
                  Disarankan menambahkan 1-2 menit sebelum waktu sholat untuk
                  persiapan
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>
                  Waktu sholat dapat berbeda ±3-5 menit tergantung lokasi
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
