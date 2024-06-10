const TriangleIcon = ({ transform = 'scale(1)', ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' transform={transform} {...props}>
      <path
        d='M11.272 5.205L16.272 13.205C16.8964 14.2041 16.1782 15.5 15 15.5H5.00002C3.82186 15.5 3.1036 14.2041 3.72802 13.205L8.72802 5.205C9.31552 4.265 10.6845 4.265 11.272 5.205Z'
      />
    </svg>
  )
}

export const TriangleUpIcon = () => <TriangleIcon />
export const TriangleDownIcon = () => <TriangleIcon transform='scale(1, -1)' />
