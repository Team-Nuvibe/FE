import { reactToChatEmoji } from "@/apis/tribe-chat/chat";
import { QUERY_KEY } from "@/constants/key";
import type { EmojiType } from "@/types/tribeChat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReactToChatEmojiParams {
  chatId: number;
  type: EmojiType;
}

function useReactToChatEmoji() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, type }: ReactToChatEmojiParams) =>
      reactToChatEmoji(chatId, type),
    onSuccess: (_, variables) => {
      // 채팅 상세 정보 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.chatDetail, variables.chatId],
      });
      // 타임라인도 갱신 (이모지 반응 요약 포함)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.chatTimeline],
      });
    },
    onError: (error) => {
      console.error("이모지 반응 실패:", error);
    },
  });
}

export default useReactToChatEmoji;
