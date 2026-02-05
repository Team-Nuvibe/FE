import { toggleTribeFavorite } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useToggleTribeFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userTribeId: number) => toggleTribeFavorite(userTribeId),
    onSuccess: () => {
      // 활성화된 트라이브 목록 갱신 (즐겨찾기 상태 변경)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.activeTribeList],
      });
    },
    onError: (error) => {
      console.error("즐겨찾기 토글 실패:", error);
    },
  });
}

export default useToggleTribeFavorite;
