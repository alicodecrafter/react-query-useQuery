import { Plus } from "lucide-react";
import { useState } from "react";
import { getDarkenColor } from "@/vote-colors/helpers";
import { useCreateColor } from "@/vote-colors/hooks/use-create-color.ts";
import { toast } from "react-toastify";
import { Color } from "@/vote-colors/types";

export const VotesColorsCreate = ({
  handleAddedColor,
}: {
  handleAddedColor?: (color: Color) => void;
}) => {
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const { mutateAsync, isPending, isError } = useCreateColor();

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await mutateAsync({
        name: newColorName,
        bg: newColorHex,
        textColor: getDarkenColor(newColorHex),
        votes: 0,
      });

      toast("Голос создан", { type: "success" });
      handleAddedColor?.(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Создать новый цвет
      </h2>

      <form onSubmit={handleAddColor} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="color-name"
            className="block text-gray-700 font-medium"
          >
            Название цвета
          </label>
          <input
            id="color-name"
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            placeholder="Enter color name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="color-picker"
            className="block text-gray-700 font-medium"
          >
            Выберите цвет
          </label>
          <input
            id="color-picker"
            type="color"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            className="w-full h-10 px-2 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-4 focus:ring-offset-2 flex items-center justify-center transition-all duration-200 ${
            isPending
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          }`}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </span>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add New Color
            </>
          )}
        </button>
      </form>
      <div
        className={`mt-4 text-center text-red-500 transition-opacity duration-300 ${
          isError ? "opacity-100" : "opacity-0"
        }`}
      >
        Error adding new color. Please try again.
      </div>
    </div>
  );
};
