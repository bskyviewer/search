import { useState, FormEvent } from "react";
import "./App.css";
import { type SearchParams } from "./store/api";
import { useSearchQuery, useGetPostsQuery } from "./store/api";

// Helper function to format dates in a user-friendly way
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function SearchResults({ query }: { query: SearchParams }) {
  // Use RTK Query hook to fetch search results
  const { data: searchData, error: searchError, isLoading: searchLoading } = useSearchQuery(query);

  // Extract post URIs from search results
  const postUris = searchData?.feed?.map(item => item.post) || [];

  // Use RTK Query hook to fetch post details
  const { data: postsData, error: postsError, isLoading: postsLoading } = useGetPostsQuery(
    { uris: postUris },
    { skip: postUris.length === 0 }
  );

  // Handle loading state
  if (searchLoading || postsLoading) {
    return <div className="loading">Loading results...</div>;
  }

  // Handle errors
  if (searchError) {
    return <div className="no-results">Error fetching search results: {JSON.stringify(searchError)}</div>;
  }

  if (postsError) {
    return <div className="no-results">Error fetching posts: {JSON.stringify(postsError)}</div>;
  }

  // Handle no results
  if (!searchData?.feed || searchData.feed.length === 0) {
    return <div className="no-results">No results found for "{query.q}"</div>;
  }

  if (!postsData?.data?.posts || postsData.data.posts.length === 0) {
    return <div className="no-results">No posts found matching "{query.q}"</div>;
  }

  return (
    <div className="search-results">
      <h2>Search Results for "{query.q}"</h2>
      <div className="results-list">
        {postsData.data.posts.map((post) => (
          <div key={post.uri} className="post-card">
            <div className="post-header">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.displayName || post.author.handle}
                  className="avatar"
                  onError={(e) => {
                    // Replace with default avatar if image fails to load
                    (e.target as HTMLImageElement).src =
                      "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  {(post.author.displayName || post.author.handle || "")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div className="author-info">
                <div className="display-name">
                  {post.author.displayName || post.author.handle}
                </div>
                <div className="handle">@{post.author.handle}</div>
              </div>
            </div>
            <div className="post-content">
              {post.record.text || "No content available"}
            </div>
            <div className="post-footer">
              <span title={new Date(post.indexedAt).toLocaleString()}>
                {formatDate(post.indexedAt)}
              </span>
              <span title="Likes">❤️ {post.likeCount || 0}</span>
              <span title="Reposts">🔄 {post.repostCount || 0}</span>
              <span title="Replies">💬 {post.replyCount || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({
        q: query,
        sort: ["relevance"],
        limit: 20,
        debug: false,
        dids: [],
      });
    }
  };

  return (
    <div className="app-container">
      <h1>Bluesky Search</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search terms..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {searchParams && <SearchResults query={searchParams} />}
    </div>
  );
}

export default App;
