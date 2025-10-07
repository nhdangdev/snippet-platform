import ImageNext, { ImageProps } from 'next/image';
import React, { forwardRef } from 'react';
import { get_path_img } from '@/helpers/get_path_img';

interface Props extends Omit<ImageProps, 'src'> {
  src?: string | null;
  alt: string;
}

export const Image = forwardRef<HTMLImageElement, Props>(({ src, alt, ...props }, ref) => {
  const path = get_path_img(src);

  return (
    <ImageNext
      src={path}
      alt={alt || 'Image'}
      {...props}
      ref={ref}
    />
  );
});

Image.displayName = 'Image';
