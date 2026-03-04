import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Jadwal = {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
};

type JadwalResponse = {
  status: boolean;
  data: {
    jadwal: Jadwal;
  };
};

const fetchJadwalSholat = async (id:string) => {
  const response = await axios.get(`https://api.myquran.com/v3/sholat/jadwal/${id}/today?tz=Asia%2FJakarta`);
  return response.data;
};

export const useJadwalSholat = (id: string) => {
  return useQuery<JadwalResponse>({
    queryKey: ["jadwal-sholat", id],
    queryFn: () => fetchJadwalSholat(id),
    enabled: !!id,
  });
};