import * as React from "react";
import { AppBskyEmbedExternal } from "@atproto/api";

export const External: React.FC<{ embed: AppBskyEmbedExternal.View }> = ({
  embed,
}) => {
  return (
    <>
      <a href={embed.external.uri} className="post-external" target="_blank">
        {embed.external.thumb && (
          <img
            alt={embed.external.title}
            src={embed.external.thumb}
            className="post-external-thumbnail"
          />
        )}
        <p>{embed.external.uri}</p>
      </a>
      <div className="post-external-content">
        <p>{embed.external.title}</p>
        <p>{embed.external.description}</p>
      </div>
    </>
  );
};
