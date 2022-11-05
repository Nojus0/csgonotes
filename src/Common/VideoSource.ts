import createVideoSource from "@Common/createVideoSource";

const S = import.meta.env.VITE_NO_THIRD_PARTY_SERVER_MODE == "true"

const VideoSource = createVideoSource(S)

export default VideoSource