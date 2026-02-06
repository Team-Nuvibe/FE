import { getDropMission } from "@/apis/home";
import { useQuery } from "@tanstack/react-query";

function useGetDropMission() {
  return useQuery({
    queryKey: ["dropMission"],
    queryFn: () => getDropMission(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export default useGetDropMission;
