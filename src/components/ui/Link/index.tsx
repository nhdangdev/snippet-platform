import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';

type LinkProps = NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

function Link(props: LinkProps) {
  return <NextLink {...props} />;
}

export { Link };
