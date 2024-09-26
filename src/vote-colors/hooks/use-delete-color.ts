import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteColor } from "@/vote-colors/api";
import { GET_COLORS_KEY } from "@/vote-colors/hooks/use-fetch-colors.ts";
import { Color } from "@/vote-colors/types";

export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColor,
    onMutate: async (colorId) => {
      await queryClient.cancelQueries({
        queryKey: GET_COLORS_KEY,
      });

      const previousColors = queryClient.getQueryData<Color[]>(GET_COLORS_KEY);

      queryClient.setQueryData<Color[]>(GET_COLORS_KEY, (oldColors) => {
        return oldColors?.filter((color) => color.id !== colorId);
      });

      return { previousColors };
    },

    onError: (_, __, context) => {
      if (context?.previousColors) {
        queryClient.setQueryData(GET_COLORS_KEY, context.previousColors);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: GET_COLORS_KEY,
      });
    },
  });
};
