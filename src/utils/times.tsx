export function getRemainingTimeFromString(targetTime: string) {
  const [hourStr, minuteStr] = targetTime.split(":");
  const targetHour = parseInt(hourStr, 10);
  const targetMinute = parseInt(minuteStr, 10);

  const now = new Date();

  const target = new Date();
  target.setHours(targetHour, targetMinute, 0, 0); // detik=0

  // Kalau target sudah lewat hari ini → ke besok
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime(); // gunakan .getTime()
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}
