import {
  type SearchParams,
  useGetPostsQuery,
  useSearchQuery,
} from "store/api.ts";
import * as React from "react";
import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import type * as AppBskyFeedDefs from "@atproto/api/src/client/types/app/bsky/feed/defs.ts";
import { Post } from "components/Post.tsx";

export const SearchResults: React.FC<{ query: SearchParams }> = ({ query }) => {
  // Use RTK Query hook to fetch search results
  const search = useSearchQuery(query);
  const uris = useMemo(
    () => search.data?.feed?.map(({ post }) => post),
    [search.data],
  );

  // Use RTK Query hook to fetch post details
  const posts = useGetPostsQuery(!uris?.length ? skipToken : { uris });

  // Handle loading state
  if (search.isLoading || posts.isLoading) {
    return <div className="loading">Loading results...</div>;
  }

  // Handle errors
  if (search.error) {
    return (
      <div className="no-results">
        Error fetching search results: {JSON.stringify(search.error)}
      </div>
    );
  } else if (posts.error) {
    return (
      <div className="no-results">
        Error fetching posts: {JSON.stringify(posts.error)}
      </div>
    );
  }

  if (!posts.data?.posts?.length) {
    return (
      <div className="no-results">No posts found matching "{query.q}"</div>
    );
  }

  return (
    <div className="search-results">
      <h2>Search Results for "{query.q}"</h2>
      <div className="results-list">
        {posts.data.posts.map((post: AppBskyFeedDefs.PostView) => (
          <Post post={post} />
        ))}
      </div>
    </div>
  );
};
