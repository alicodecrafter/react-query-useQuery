import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColor } from "@/vote-colors/api";
import { GET_COLORS_KEY } from "@/vote-colors/hooks/use-fetch-colors.ts";

export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: GET_COLORS_KEY,
      });
    },
  });
};
