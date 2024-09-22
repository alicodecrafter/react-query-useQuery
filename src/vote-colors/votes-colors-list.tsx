import { ThumbsUp, Trash2 } from "lucide-react";
import { useFetchColors } from "@/vote-colors/hooks/use-fetch-colors.ts";
import { useUpdateColor } from "@/vote-colors/hooks/use-update-color.ts";
import { Color } from "@/vote-colors/types";
import { toast } from "react-toastify";
import { useDeleteColor } from "@/vote-colors/hooks/use-delete-color.ts";

export const VoteColorsList = () => {
  const { data: colors, isLoading, isError } = useFetchColors();
  const {
    mutate,
    isPending: isUpdatingVote,
    isError: isUpdateError,
  } = useUpdateColor();

  const { mutate: onDelete, isPending: isDeletingVote } = useDeleteColor();

  const handleVote = ({ id, votes }: Color) => {
    mutate(
      {
        id,
        votes: votes + 1,
      },
      {
        onSuccess: () => {
          toast("Голос учтен", { type: "success" });
        },
        onError: () => {
          toast("Ошибка при учете голоса", { type: "error" });
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    onDelete(id, {
      onSuccess: () => {
        toast("Голос удален", { type: "success" });
      },
      onError: () => {
        toast("Ошибка при удалении голоса", { type: "error" });
      },
    });
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
        Голосуйте за свой любимый цвет
      </h2>

      {isError && !colors && (
        <div className="text-center text-red-500">
          Ошибка при загрузке цветов
        </div>
      )}

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 p-4 rounded-md flex items-center justify-between"
            >
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="flex items-center">
                <div className="h-4 w-8 bg-gray-300 rounded mr-2"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {colors?.map((color) => (
          <div
            key={color.name}
            style={{
              backgroundColor: color.bg,
            }}
            className={`p-4 rounded-md shadow-sm flex items-center justify-between`}
          >
            <span
              style={{
                color: color.textColor,
              }}
              className={`font-semibold `}
            >
              {color.name}
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-bold mr-2 text-white transition-all duration-300">
                {color.votes}
              </span>
              <button
                onClick={() => handleVote(color)}
                disabled={isUpdatingVote}
                className={`bg-white text-gray-800 px-3 py-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color.bg} disabled:opacity-50 transition-transform duration-200 ease-in-out transform hover:scale-105 ${
                  isUpdatingVote ? "cursor-not-allowed" : ""
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(color.id)}
                disabled={isDeletingVote}
                className={`bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 transition-transform duration-200 ease-in-out transform hover:scale-105 ${
                  isDeletingVote ? "cursor-not-allowed" : ""
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isUpdateError && (
        <div className="mt-4 text-center text-red-500">
          Error updating votes. Please try again.
        </div>
      )}
    </div>
  );
};
