import * as React from "react";

// A minimal mock that renders an img with passed props; ignores Next.js optimization-only props.
const MockNextImage = React.forwardRef<HTMLImageElement, any>(function Image(props, ref) {
  const { src, alt, ...rest } = props;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img ref={ref} src={typeof src === "string" ? src : (src?.src || "")} alt={alt} {...rest} />;
});

export default MockNextImage;
