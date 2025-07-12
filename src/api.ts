import { use, useMemo } from "react";
import { AppBskyFeedGetFeedSkeleton, AtpAgent } from "@atproto/api";

export interface SearchParams {
  q: string;
  sort: string[];
  limit: number;
  debug: boolean;
  dids: string[];
  before?: string;
  after?: string;
}

const agent = new AtpAgent({ service: "https://bsky.social" });

export function useSearch(query: SearchParams) {
  const promise = useMemo(async () => {
    try {
      return await fetch("http://localhost:8080/feed", {
        method: "POST",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => (res.ok ? res.json() : {}));
    } catch (e) {
      console.log(e);
      return {};
    }
  }, [query]);
  const skeleton = use(promise) as AppBskyFeedGetFeedSkeleton.OutputSchema;
  console.log(skeleton);
  const posts = useMemo(
    () =>
      skeleton.feed
        ? agent.getPosts({ uris: skeleton.feed.map((p) => p.post) })
        : {},
    [skeleton],
  );
  return use(posts);
}
