import { getActiveTribeList } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

interface UseGetActiveTribeListParams {
  cursorFav?: boolean;
  cursorLastActivityAt?: string;
  cursorUnread?: boolean;
  cursorLastChatId?: number;
  size?: number;
  refetchInterval?: number;
}

function useGetActiveTribeList(
  params: UseGetActiveTribeListParams = {},
  options?: Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'>
) { 
const {
  cursorFav,
  cursorLastActivityAt,
  cursorUnread,
  cursorLastChatId,
  size = 20,
  refetchInterval,
} = params;
  return useQuery({
    queryKey: [
      QUERY_KEY.activeTribeList,
      cursorFav,
      cursorLastActivityAt,
      cursorUnread,
      cursorLastChatId,
      size,
    ],
    queryFn: () =>
      getActiveTribeList(
        cursorFav,
        cursorLastActivityAt,
        cursorUnread,
        cursorLastChatId,
        size,
      ),
    refetchInterval,
  });
}

export default useGetActiveTribeList;
