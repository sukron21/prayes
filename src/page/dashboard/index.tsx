"use client";

import { useEffect, useMemo, useState } from "react";
import { PrayerGrid, type Prayer } from "../../components/prayer-grid";
import { PrayerHeader } from "../../components/prayer-header";
import { getRemainingTimeFromString } from "../../utils/times";
import { useSholat } from "../../api/daerah";
import { useJadwalSholat } from "../../api/jadwal-sholat";
// import { PrayerHeader } from '@/components/prayer-header';

interface Jadwal {
  tanggal: string;
  imsak: string;
  subuh: string;
  dzuhur: string; // sesuaikan dengan API (dzuhur/zuhur)
  ashar: string;
  maghrib: string;
  isya: string;
}

export default function Home() {
  const [id, setId] = useState<string>("58a2fc6ed39fd083f55d4182bf88826d");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState<number>(-1);
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
  const { data } = useSholat();
  const { data: dataSholat, isLoading, isError } = useJadwalSholat(id);

  // let prayerTimes: Prayer[] = [];
  const prayerTimes = useMemo(() => {
    if (!dataSholat?.data?.jadwal) return [];

    // 1. Ambil semua kunci tanggal (misal: ["2026-03-04"])
    const dateKeys = Object.keys(dataSholat.data.jadwal);
    const firstDate = dateKeys[0];

    // 2. Beritahu TS bahwa 'dataSholat.data.jadwal' adalah kumpulan objek Jadwal
    // Gunakan 'any' sementara atau Record<string, any> untuk memintas pengecekan ketat
    const semuaJadwal = dataSholat.data.jadwal as Record<string, any>;

    // 3. Ambil data untuk tanggal pertama
    const jadwalHariIni = semuaJadwal[firstDate] as Jadwal;

    if (!jadwalHariIni) return [];

    return [
      { name: "Imsak", arabicName: "إمساك", time: jadwalHariIni.imsak },
      { name: "Subuh", arabicName: "الفجر", time: jadwalHariIni.subuh },
      // Pastikan di interface & JSON namanya sama (dzuhur vs zuhur)
      {
        name: "Dzuhur",
        arabicName: "الظهر",
        time: jadwalHariIni.dzuhur || jadwalHariIni.dzuhur,
      },
      { name: "Ashar", arabicName: "العصر", time: jadwalHariIni.ashar },
      { name: "Maghrib", arabicName: "المغرب", time: jadwalHariIni.maghrib },
      { name: "Isya", arabicName: "العشاء", time: jadwalHariIni.isya },
    ];
  }, [dataSholat]);

  useEffect(() => {
    const updateTime = () => {
      if (!prayerTimes || prayerTimes.length === 0) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      let current = -1;
      let next = 0;

      for (let i = 0; i < prayerTimes.length; i++) {
        const timeString = prayerTimes[i]?.time;

        // Proteksi jika properti time tidak ada
        if (!timeString) continue;

        const [h, m] = timeString.split(":").map(Number);
        const prayerTimeInMinutes = h * 60 + m;

        // Logika menentukan jadwal saat ini dan selanjutnya
        if (prayerTimeInMinutes <= currentTimeInMinutes) {
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
  }, [prayerTimes]);

  if (isLoading) return <div>Menarik data...</div>;
  if (isError) return <div>Gagal memuat data.</div>;

  // if (dataSholat?.data?.jadwal) {
  //   // TypeScript sekarang tahu jadwal bukan undefined
  //   const dateKeys = Object.keys(dataSholat.data.jadwal);
  //   const firstDate = dateKeys[0];

  //   const jadwalHariIni = (dataSholat.data.jadwal as Record<string, any>)[
  //     firstDate
  //   ];

  //   prayerTimes = [
  //     { name: "Imsak", arabicName: "إمساك", time: jadwalHariIni.imsak },
  //     { name: "Subuh", arabicName: "الفجر", time: jadwalHariIni.subuh },
  //     { name: "Dzuhur", arabicName: "الظهر", time: jadwalHariIni.zuhur },
  //     { name: "Ashar", arabicName: "العصر", time: jadwalHariIni.ashar },
  //     { name: "Maghrib", arabicName: "المغرب", time: jadwalHariIni.maghrib },
  //     { name: "Isya", arabicName: "العشاء", time: jadwalHariIni.isya },
  //   ];
  // }
  // const prayerTimes: Prayer[] = [
  //   { name: "Subuh", arabicName: "الفجر", time: "04:45" },

  //   { name: "Dzuhur", arabicName: "الظهر", time: "12:15" },

  //   { name: "Ashar", arabicName: "العصر", time: "15:45" },

  //   { name: "Maghrib", arabicName: "المغرب", time: "18:30" },

  //   { name: "Isya", arabicName: "العشاء", time: "20:00" },
  // ];

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
