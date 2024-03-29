import { Component, JSX } from "solid-js"

const KeyIcon: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = p => {
  return (
    <svg
      width="24"
      height="30"
      viewBox="0 0 24 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        d="M4.20496 1.6042C-0.145045 4.5192 -1.30904 10.4092 1.60496 14.7582C3.84696 18.1062 7.85095 19.5582 11.56 18.7242L13.028 20.7962L15.113 21.1922L14.546 23.2342L15.162 24.1492L17.722 24.4942L17.082 27.0412L17.875 28.2262L23.487 29.5392L23.969 24.4322L17.423 14.6622C19.435 11.5742 19.537 7.4592 17.359 4.2052C14.444 -0.144797 8.55595 -1.3088 4.20496 1.6042ZM8.71296 8.5632C7.49296 9.3812 5.84196 9.0552 5.02496 7.8342C4.20796 6.6132 4.53496 4.9642 5.75396 4.1452C6.97396 3.3302 8.62496 3.6562 9.44196 4.8752C10.258 6.0942 9.93196 7.7462 8.71296 8.5632Z"
        fill="white"
      />
    </svg>
  )
}

export default KeyIcon
