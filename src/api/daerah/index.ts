import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSholat = async () => {
  const response = await axios.get("https://api.myquran.com/v3/sholat/kabkota/semua");
  return response.data;
};

export const useSholat = () => {
  return useQuery({
    queryKey: ["sholat"], // key unik query
    queryFn: fetchSholat, // fungsi fetch data
  });
};