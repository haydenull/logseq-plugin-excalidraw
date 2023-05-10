import React, { FC } from "react";

interface SVGComponentProps {
  svgElement: SVGSVGElement;
}

const SVGComponent: FC<SVGComponentProps> = ({ svgElement }) => {
  return <div dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }} />;
};

export default SVGComponent;
