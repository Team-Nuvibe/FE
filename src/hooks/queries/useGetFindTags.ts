import { getFindTags } from "@/apis/tag";
import { useQuery } from "@tanstack/react-query";

function useGetFindTags(category: string) {
  return useQuery({
    queryKey: ["findTags", category],
    queryFn: () => getFindTags(category),
    enabled: !!category,
    placeholderData: undefined,
    staleTime: 0,
  });
}

export default useGetFindTags;
