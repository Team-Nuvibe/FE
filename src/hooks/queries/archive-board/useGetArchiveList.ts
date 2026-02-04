import { getArchiveList } from "@/apis/archive-board/archive";
import { useQuery } from "@tanstack/react-query";

function useGetArchiveList() {
  return useQuery({
    queryKey: ["archive-board"],
    queryFn: () => getArchiveList(),
  })
}

export default useGetArchiveList;