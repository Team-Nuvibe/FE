import { getTagsByCategory } from "@/apis/home";
import type { TagCategory } from "@/types/home";
import { useQuery } from "@tanstack/react-query";

function useGetTagsByCategory(category: TagCategory) {
  return useQuery({
    queryKey: ["tags", category],
    queryFn: () => getTagsByCategory(category),
  });
}

export default useGetTagsByCategory;
