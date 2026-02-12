import { getSearchTags } from "@/apis/tag";
import { useQuery } from "@tanstack/react-query";

function useGetSearchTags(search: string) {
  return useQuery({
    queryKey: ["searchTags", search],
    queryFn: () => getSearchTags(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export default useGetSearchTags;
