import { getChatDetail } from "@/apis/tribe-chat/chat";
import { QUERY_KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";

function useGetChatDetail(chatId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.chatDetail, chatId],
    queryFn: () => getChatDetail(chatId),
    enabled: !!chatId,
  });
}

export default useGetChatDetail;
