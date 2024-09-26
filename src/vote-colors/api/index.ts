import { Api } from "@/lib/api";
import { AddColor, Color, UpdateColorVotes } from "@/vote-colors/types";

export const fetchColors = () => Api.get<Color[]>("/colors");

export const voteForColor = ({ id, votes }: UpdateColorVotes) =>
  Api.patch<Color>(`/colorsss/${id}`, {
    votes,
  });

export const createColor = (color: AddColor) =>
  Api.post<Color>("/colors", color);

export const deleteColor = (colorId: Color["id"]) =>
  Api.delete<Color>(`/colors/${colorId}`);
