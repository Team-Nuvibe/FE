import { getFindTags } from "@/apis/tag";
import { useQuery } from "@tanstack/react-query";

function useGetFindTags(category: string) {
  return useQuery({
    queryKey: ["tags", category],
    queryFn: () => getFindTags(category),
    enabled: !!category,
  });
}

export default useGetFindTags;
