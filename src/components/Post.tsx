import { Embed } from "components/embed/Embed.tsx";
import {
  AppBskyEmbedRecord,
  AppBskyFeedDefs,
  AppBskyFeedPost,
} from "@atproto/api";
import * as React from "react";

export type PostView = AppBskyFeedDefs.PostView | AppBskyEmbedRecord.ViewRecord;

function getUrl(post: PostView): string {
  return `https://bsky.app/profile/${post.author.did}/post/${post.uri.split("/").at(-1)}`;
}

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

export const Post: React.FC<{
  post: PostView;
}> = ({ post }) => {
  let record: AppBskyFeedPost.Record | null = null;
  let isEmbed = false;
  if ("value" in post && AppBskyFeedPost.isRecord(post.value)) {
    record = post.value as AppBskyFeedPost.Record;
    isEmbed = true;
  } else if ("record" in post && AppBskyFeedPost.isRecord(post.record)) {
    record = post.record as AppBskyFeedPost.Record;
  } else {
    console.error("Invalid post", post);
  }

  return (
    <div
      key={post.uri}
      className={isEmbed ? "post-card-embedded" : "post-card"}
    >
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
            {post.author.displayName || post.author.handle || ""}
          </div>
        )}
        <div className="author-info">
          <div className="display-name">
            {post.author.displayName || post.author.handle}
          </div>
          <div className="handle">@{post.author.handle}</div>
        </div>
      </div>
      {record?.text ? <div className="post-content">{record?.text}</div> : null}
      {"embed" in post && post.embed && <Embed embed={post.embed} />}
      {!isEmbed && (
        <div className="post-footer">
          <a
            href={getUrl(post)}
            title={new Date(post.indexedAt).toLocaleString()}
            target="_blank"
          >
            {formatDate(post.indexedAt)}
          </a>
          <span title="Likes">❤️ {post.likeCount || 0}</span>
          <span title="Reposts">🔄 {post.repostCount || 0}</span>
          <span title="Replies">💬 {post.replyCount || 0}</span>
        </div>
      )}
    </div>
  );
};
