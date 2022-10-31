import { TransitionProps } from "@Common/Utils";

export function getFadeAnimation(duration: number): TransitionProps {
  return {
    onEnter: (e, done) => {
      e.animate(
        [
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        ],
        { duration, easing: "ease-in-out" }
      ).finished.then(done);
    },
    onExit: (e, done) => {
      e.animate(
        [
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
        ],
        { duration, easing: "ease-in-out" }
      ).finished.then(done);
    },
  };
}
