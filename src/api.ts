import { use, useMemo } from "react";
import { AppBskyFeedGetFeedSkeleton, AtpAgent } from "@atproto/api";

interface IndexParams {
  q: string;
  sort: string[];
  limit: number;
  debug: boolean;
  dids: string[];
  before?: string;
  after?: string;
}

const agent = new AtpAgent({ service: "https://bsky.social" });

export function useSearch(query: IndexParams) {
  const promise = useMemo(
    () =>
      fetch("https://indexer-hp2l.onrender.com/feed", {
        method: "POST",
        body: JSON.stringify(query),
      }),
    [query],
  );
  const skeleton = use(promise.then((res) => res.json()));
  const posts = useMemo(
    () => skeleton && agent.getPosts({ uris: skeleton.uris }),
    [skeleton],
  );
  return use(posts);
}
