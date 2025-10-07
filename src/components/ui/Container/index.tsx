import React, { forwardRef, ReactNode, ElementType } from 'react';
import clsx from 'clsx';

interface Props {
  className?: string;
  children: ReactNode;
  as?: ElementType;
}

export const Container = forwardRef<HTMLElement, Props>(
  ({ className, children, as: Component = 'section', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
