import { getActiveTribeList } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";

interface UseGetActiveTribeListParams {
  cursorFav?: boolean;
  cursorLastActivityAt?: string;
  cursorUnread?: boolean;
  cursorLastChatId?: number;
  size?: number;
}

function useGetActiveTribeList({
  cursorFav,
  cursorLastActivityAt,
  cursorUnread,
  cursorLastChatId,
  size = 20,
}: UseGetActiveTribeListParams = {}) {
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
  });
}

export default useGetActiveTribeList;
