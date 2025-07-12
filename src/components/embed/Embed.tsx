import type * as AppBskyFeedDefs from "@atproto/api/src/client/types/app/bsky/feed/defs.ts";
import * as React from "react";
import {
  AppBskyEmbedExternal,
  AppBskyEmbedRecord,
  AppBskyEmbedVideo,
} from "@atproto/api";
import * as AppBskyEmbedImages from "@atproto/api/src/client/types/app/bsky/embed/images.ts";
import { Images } from "./Images.tsx";
import { Video } from "components/embed/Video.tsx";
import { External } from "components/embed/External.tsx";
import { Post } from "components/Post.tsx";

type Props = { embed: AppBskyFeedDefs.PostView["embed"]; labels?: string[] };

const Content: React.FC<Props> = ({ embed }) => {
  if (AppBskyEmbedImages.isView(embed)) {
    return <Images embed={embed} />;
  } else if (AppBskyEmbedVideo.isView(embed)) {
    return <Video embed={embed} />;
  } else if (AppBskyEmbedExternal.isView(embed)) {
    return <External embed={embed} />;
  } else if (AppBskyEmbedRecord.isView(embed)) {
    const record = embed.record;
    if (AppBskyEmbedRecord.isViewRecord(record)) {
      return <Post post={record} />;
    }
  }
};

const Censor: React.FC<React.PropsWithChildren<{ labels?: string[] }>> = ({
  labels,
  children,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  if (labels?.length) {
    return (
      <div className={`censored-content ${isVisible ? "visible" : "hidden"}`}>
        {!isVisible ? (
          <div className="censored-overlay" onClick={() => setIsVisible(true)}>
            <span className="censored-message">
              Labeled with: {labels.join(", ")}. Click to show.
            </span>
          </div>
        ) : (
          <div className="censored-header">
            <span className="censored-warning">Censored content</span>
            <button
              className="censored-toggle"
              onClick={() => setIsVisible(false)}
            >
              Hide content
            </button>
          </div>
        )}
        <div className="censored-content-inner">{children}</div>
      </div>
    );
  } else {
    return children;
  }
};

export const Embed: React.FC<Props> = ({ embed, labels }) => {
  return (
    <Censor labels={labels}>
      <Content embed={embed} />
    </Censor>
  );
};
