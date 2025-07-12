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

export const Embed: React.FC<Pick<AppBskyFeedDefs.PostView, "embed">> = ({
  embed,
}) => {
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
