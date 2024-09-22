export type Color = {
  id: number;
  name: string;
  votes: number;
  bg: string;
  textColor: string;
};

export type UpdateColorVotes = Pick<Color, "id" | "votes">;

export type AddColor = Omit<Color, "id">;
