import { toggleImageScrap } from "@/apis/tribe-chat/scrapimage";
import { QUERY_KEY } from "@/constants/key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useToggleImageScrap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: number) => toggleImageScrap(chatId),
    onSuccess: (_, chatId) => {
      // 채팅 상세 정보 갱신 (스크랩 상태 변경)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.chatDetail, chatId],
      });
      // 스크랩 이미지 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.scrapedImages],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.tribeScrapedImages],
      });
    },
    onError: (error) => {
      console.error("이미지 스크랩 토글 실패:", error);
    },
  });
}

export default useToggleImageScrap;
