interface CardImageProps {
  post: {
    id: number;
    title: string;
    thumbnailUrl: string;
  };
}

export const CardImage = ({ post }: CardImageProps) => {
  return (
    <div className="bg-white border rounded-lg mb-8">
      <img src={post.thumbnailUrl} alt={post.title} />
      <div className="p-4">{post.title}</div>
    </div>
  );
};
