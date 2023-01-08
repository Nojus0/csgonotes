import { StaticVideoSource, ThirdPartyVideoSource } from "@Common/VideoSources"

const VideoSource = import.meta.env.VITE_NO_THIRD_PARTY_SERVER_MODE == "true" ? StaticVideoSource : ThirdPartyVideoSource

export default VideoSource
