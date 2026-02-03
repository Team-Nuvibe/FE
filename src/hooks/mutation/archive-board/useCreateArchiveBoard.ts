import { createArchiveBoard } from "@/apis/archive-board/archive";
import { queryClient } from "@/App";
import { useMutation } from "@tanstack/react-query";

function useCreateArchiveBoard(name: string) {
  return useMutation({
    mutationFn: () => createArchiveBoard(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archive-board"] });
    }
  })
}

export default useCreateArchiveBoard;