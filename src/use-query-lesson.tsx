import {
  useInfiniteQuery,
  usePrefetchQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { CardImage } from "@/components/card-post.tsx";

type Order = "asc" | "desc";

type useFetchPostsProps = {
  page: number;
  order?: Order;
};

type Post = {
  id: number;
  title: string;
};

type Comment = {
  id: number;
  name: string;
  email: string;
  body: string;
};

const getPostsQueryOptions = ({ page, order = "asc" }: useFetchPostsProps) => ({
  queryKey: [
    "posts",
    {
      page,
      order,
    },
  ],
  queryFn: () =>
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}&_order=${order}&_sort=id`,
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }),
  staleTime: 10000,
});

const useFetchPosts = ({ page, order = "asc" }: useFetchPostsProps) => {
  return useQuery<Post[]>({
    ...getPostsQueryOptions({ page, order }),
    placeholderData: (previousData) => {
      return previousData;
    },
  });
};

const getPostQueryOptions = (id: number) => ({
  queryKey: ["post", id],
  queryFn: () =>
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
    ),
  staleTime: 5000,
});

const useFetchPost = (id: number) => {
  return useQuery<Post>(getPostQueryOptions(id));
};

const useFetchComments = (postId: number | null) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () =>
      fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
      ).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }),
    enabled: Boolean(postId),
  });
};

const MAX_PAGES = 5;

const useFetchInifinityPhotos = () => {
  return useInfiniteQuery({
    queryKey: ["photos"],
    queryFn: ({ pageParam }) => {
      return fetch(
        `https://jsonplaceholder.typicode.com/photos?_limit=5&_page=${pageParam}`,
      ).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      });
    },
    initialPageParam: 997,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
};

function UseQueryLesson() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchInifinityPhotos();

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isLoading) return;

    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreButtonRef.current) {
      observer.current.observe(loadMoreButtonRef.current);
    }

    return () => {
      if (observer.current && loadMoreButtonRef.current) {
        observer.current.unobserve(loadMoreButtonRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

  return (
    <>
      <div className={"grid grid-cols-5 gap-4"}>
        {isLoading && <p>Loading...</p>}
        {data &&
          data.pages
            .flat()
            .map((photo) => <CardImage key={photo.id} post={photo} />)}
      </div>

      <Button
        ref={loadMoreButtonRef}
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage || !hasNextPage}
      >
        {isFetchingNextPage ? "Loading more..." : "Load more"}
      </Button>
    </>
  );
}

function App1() {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<Order>("asc");
  const { data, isLoading, isError, isPlaceholderData } = useFetchPosts({
    page,
    order,
  });

  const [postId, setPostId] = useState<number | null>(null);

  usePrefetchQuery(getPostsQueryOptions({ page: page + 1, order }));

  const { data: comments, isLoading: isLoadingComments } =
    useFetchComments(postId);

  const queryClient = useQueryClient();

  const timerId = useRef<NodeJS.Timeout | null>(null);

  if (postId) {
    return (
      <>
        <PostDetails postId={postId} onBack={() => setPostId(null)} />

        <h2>Comments</h2>
        {isLoadingComments && <p>Loading comments...</p>}
        {comments && (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.name}</li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-2">
          <h1 className="text-xl font-bold text-foreground">React query</h1>
        </div>
      </header>
      <Button onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}>
        Toggle order ({order})
      </Button>
      <div className={"flex gap-2 mt-2"}>
        <Button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1 || isPlaceholderData}
        >
          prev page ({page})
        </Button>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === MAX_PAGES || isPlaceholderData}
        >
          next page ({page})
        </Button>
      </div>

      <main className="container mx-auto py-6">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        {data && (
          <ul className={isPlaceholderData ? "opacity-50" : "opacity-100"}>
            {data.map((post) => (
              <li
                key={post.id}
                onClick={() => {
                  setPostId(post.id);
                }}
                onMouseEnter={() => {
                  timerId.current = setTimeout(() => {
                    queryClient.prefetchQuery(getPostQueryOptions(post.id));
                  }, 300);
                }}
                onMouseLeave={() => {
                  if (timerId.current) {
                    clearTimeout(timerId.current);
                  }
                }}
              >
                {post.title}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

const PostDetails = ({
  postId,
  onBack,
}: {
  postId: number;
  onBack: () => void;
}) => {
  const { data, isLoading, isError } = useFetchPost(postId);

  return (
    <main className="container mx-auto py-6">
      <Button onClick={() => onBack()}>Back</Button>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data</p>}
      {data && (
        <>
          <h1>{data.title}</h1>
          <hr />
        </>
      )}
    </main>
  );
};

export default UseQueryLesson;
