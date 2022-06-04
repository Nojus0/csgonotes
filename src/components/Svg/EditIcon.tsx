import { Component, JSX } from "solid-js";

const EditIcon: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (p) => {
  return (
    <svg
      width="29"
      height="30"
      viewBox="0 0 29 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.294 28.736L0.543999 29.361L1.17 22.612L17.204 6.57697L23.329 12.702L7.294 28.736Z"
        fill="#FCFCFC"
      />
      <path
        d="M28.9669 7.06316L22.8427 0.938965L19.0152 4.7665L25.1394 10.8907L28.9669 7.06316Z"
        fill="#FCFCFC"
      />
    </svg>
  );
};

export default EditIcon;
