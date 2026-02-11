import { toggleTribeMute } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useToggleTribeMute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userTribeId: number) => toggleTribeMute(userTribeId),
    onSuccess: () => {
      // 활성화된 트라이브 목록 갱신 (음소거 상태 변경)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.activeTribeList],
      });
    },
    onError: (error) => {
      console.error("음소거 토글 실패:", error);
    },
  });
}

export default useToggleTribeMute;
