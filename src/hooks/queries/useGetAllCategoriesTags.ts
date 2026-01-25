import { getTagsByCategory } from "@/apis/home";
import { categoriesList } from "@/constants/categoriesList";
import { useQueries } from "@tanstack/react-query";

function useGetAllCategoriesTags() {
  const categoryQueries = useQueries({
    queries: categoriesList.map((category) => ({
      queryKey: ["tags", category],
      queryFn: () => getTagsByCategory(category),
    })),
  });
  const categories = categoriesList.map((category, index) => ({
    name: category,
    items: categoryQueries[index].data?.data || [],
  }));
  return { categories, categoryQueries };
}

export default useGetAllCategoriesTags;
