import { Component, JSX } from "solid-js";

const QuitIcon: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (p) => {
  return (
    <svg
      width="30"
      height="31"
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path d="M16.529 0.937988H13.529V15.615H16.529V0.937988Z" fill="white" />
      <path
        d="M21.517 2.98401L20.132 5.64301C23.92 7.52401 26.53 11.422 26.53 15.938C26.53 22.289 21.381 27.438 15.03 27.438C8.67901 27.438 3.53001 22.289 3.53001 15.938C3.53001 11.405 6.15901 7.49601 9.97001 5.62301L8.59601 2.95801C3.82001 5.33001 0.529007 10.244 0.529007 15.938C0.529007 23.946 7.02101 30.438 15.029 30.438C23.037 30.438 29.529 23.946 29.529 15.938C29.529 10.265 26.264 5.36601 21.517 2.98401Z"
        fill="white"
      />
    </svg>
  );
};

export default QuitIcon;
