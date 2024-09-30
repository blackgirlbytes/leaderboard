import React from 'react';

const Typography = ({ variant, className, children, ...props }) => {
  const variantClasses = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
  };

  const Component = variant || 'p';

  return (
    <Component className={`${variantClasses[variant] || ''} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export { Typography };