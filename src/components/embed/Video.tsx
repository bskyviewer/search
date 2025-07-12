import * as React from "react";
import { useEffect, useState } from "react";
import { AppBskyEmbedVideo } from "@atproto/api";
import Hls from "hls.js";

export const Video: React.FC<{ embed: AppBskyEmbedVideo.View }> = ({
  embed,
}) => {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef && Hls.isSupported() && AppBskyEmbedVideo.isView(embed)) {
      const hls = new Hls();
      hls.on(Hls.Events.ERROR, console.error);
      hls.loadSource(embed.playlist);
      hls.attachMedia(videoRef);
    }
  }, [videoRef, embed]);

  return (
    <div className="post-video">
      <video
        controls
        poster={embed.thumbnail}
        className="post-video-player"
        ref={setVideoRef}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
