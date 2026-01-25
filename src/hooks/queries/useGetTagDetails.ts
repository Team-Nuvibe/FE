import { getTagDetails } from "@/apis/home";
import { useQuery } from "@tanstack/react-query";

function useGetTagDetails(tag: string) {
  return useQuery({
    queryKey: ["tagDetails", tag],
    queryFn: () => getTagDetails(tag),
    enabled: !!tag,
  });
}

export default useGetTagDetails;
