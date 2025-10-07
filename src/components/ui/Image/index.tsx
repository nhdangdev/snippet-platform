import { get_path_img } from '@/helpers/get_path_img';
import ImageNext, { ImageProps } from 'next/image';
import { forwardRef } from 'react';

type Props = Omit<ImageProps, 'src'> & {
  src?: string | null;
  alt: string;
};

export const Image = forwardRef<HTMLImageElement, Props>(
  ({ src, alt, ...props }, ref) => {
    const path = get_path_img(src);

    return (
      <ImageNext
        src={src || path}
        alt={alt}
        {...props}
        ref={ref}
      />
    );
  }
);

Image.displayName = 'Image';
