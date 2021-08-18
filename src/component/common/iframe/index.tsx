import React from 'react';

interface IProps {
  /**
   * @setter.title src
   * @vision true
   */
  src: string;

  /**
   * @setter.title width
   * @vision true
   */
  width: number | string;

  /**
   * @setter.title height
   * @vision true
   */
  height: number | string;

  visible?: boolean;
}

/**
 * @author 云昏
 * @workNo 270831
 * @category Basic
 * @vision.title Iframe
 * @visible true
 * @description Iframe
 */
export default function Iframe({ src, width, height, visible }: IProps) {
  console.log(visible, 'visible');
  if (visible) {
    return <iframe src={src + '#toolbar=0'} width={width} frameBorder="0" height={height} />;
  } else {
    return <div></div>;
  }
}
