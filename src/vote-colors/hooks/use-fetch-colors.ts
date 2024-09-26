import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchColors } from "@/vote-colors/api";
import { Color } from "@/vote-colors/types";

export const useFetchColors = <TData = Color[]>(
  options?: Omit<
    UseQueryOptions<Color[], Error, TData>,
    "queryFn" | "queryKey"
  >,
) => {
  return useQuery({
    queryKey: GET_COLORS_KEY,
    queryFn: fetchColors,
    ...options,
  });
};

export const GET_COLORS_KEY = ["colors"];
