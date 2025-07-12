import * as React from "react";
import * as AppBskyEmbedImages from "@atproto/api/src/client/types/app/bsky/embed/images.ts";

export const Images: React.FC<{ embed: AppBskyEmbedImages.View }> = ({
  embed,
}) => (
  <div className="post-images">
    {embed.images.map((image, index) => (
      <img
        key={index}
        src={image.thumb}
        alt={image.alt || "Post image"}
        className="post-image"
        onClick={() => window.open(image.fullsize, "_blank")}
      />
    ))}
  </div>
);
