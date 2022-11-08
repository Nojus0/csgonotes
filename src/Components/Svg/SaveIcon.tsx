import { Component, JSX } from "solid-js"

const SaveIcon: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = p => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        d="M18.3772 0H0V24.439H23.339V5.37776L18.3772 0ZM6.13237 3.29157H17.6051V9.78008H6.13237V3.29157ZM19.4879 21.6455H3.85276V12.4789H19.4879V21.6455Z"
        fill="#F9F9FA"
      />
      <path
        d="M16.6629 3.90007H14.5875V9.05452H16.6629V3.90007Z"
        fill="#F9F9FA"
      />
      <path
        d="M17.5239 15.0034H5.65344V15.5746H17.5239V15.0034Z"
        fill="#F9F9FA"
      />
      <path
        d="M17.5239 16.8364H5.65344V17.4076H17.5239V16.8364Z"
        fill="#F9F9FA"
      />
      <path
        d="M17.5239 18.6702H5.65344V19.2414H17.5239V18.6702Z"
        fill="#F9F9FA"
      />
    </svg>
  )
}

export default SaveIcon
