import { getWaitingTribeList } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";

interface UseGetWaitingTribeListParams {
  cursorTribeId?: number;
  size?: number;
}

function useGetWaitingTribeList({
  cursorTribeId,
  size = 20,
}: UseGetWaitingTribeListParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY.waitingTribeList, cursorTribeId, size],
    queryFn: () => getWaitingTribeList(cursorTribeId, size),
  });
}

export default useGetWaitingTribeList;
