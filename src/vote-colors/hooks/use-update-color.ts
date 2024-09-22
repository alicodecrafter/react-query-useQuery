import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteForColor } from "@/vote-colors/api";
import { GET_COLORS_KEY } from "@/vote-colors/hooks/use-fetch-colors.ts";
import { Color } from "@/vote-colors/types";

export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voteForColor,
    onMutate: async (newVote) => {
      await queryClient.cancelQueries({
        queryKey: GET_COLORS_KEY,
      });

      const previousColors = queryClient.getQueryData<Color[]>(GET_COLORS_KEY);

      queryClient.setQueryData<Color[]>(GET_COLORS_KEY, (oldColors) => {
        return oldColors?.map((color) =>
          color.id === newVote.id
            ? { ...color, votes: color.votes + 1 }
            : color,
        );
      });

      return { previousColors };
    },

    onError: (_, __, context) => {
      console.log(context);
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
