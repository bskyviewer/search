import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AppBskyFeedGetFeedSkeleton,
  AppBskyFeedGetPosts,
  AtpAgent,
} from "@atproto/api";

export interface SearchParams {
  q: string;
  sort: string[];
  limit: number;
  debug: boolean;
  dids: string[];
  before?: string;
  after?: string;
}

// Create a shared agent instance
const agent = new AtpAgent({ service: "https:/public.api.bsky.app" });

// Define the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_INDEXER_URL }),
  endpoints: (builder) => ({
    // Search endpoint
    search: builder.query<
      AppBskyFeedGetFeedSkeleton.OutputSchema,
      SearchParams
    >({
      query: (params) => ({
        url: "feed",
        method: "POST",
        body: params,
      }),
    }),

    // Get posts endpoint
    getPosts: builder.query<
      AppBskyFeedGetPosts.OutputSchema,
      AppBskyFeedGetPosts.QueryParams
    >({
      queryFn: async ({ uris }) => {
        try {
          const response = await agent.getPosts({ uris });
          return { data: response.data };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
    }),
  }),
});

// Export the auto-generated hooks
export const { useSearchQuery, useGetPostsQuery } = apiSlice;
