import { cn } from '@/lib/utils';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';

type LinkProps = NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

function Link({ className, ...props }: LinkProps) {
  return <NextLink className={cn('text-gray-600 hover:text-gray-900', className)}{...props} />;
}

export { Link };

