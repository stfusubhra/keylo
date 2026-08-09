import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  hover = false,
  hoverLift = false,
  padding = 'lg',
  ...props
}, ref) => {
  const paddings = {
    none: '',
    sm: 'p-sm',
    md: 'p-md',
    lg: 'p-lg',
    xl: 'p-xl',
  };

  const hoverStyles = hover ? 'hover:-translate-y-1 hover:translate-x-1 hover:shadow-hard-negative transition-all cursor-pointer' : '';
  const hoverLiftStyles = hoverLift ? 'hover:-translate-y-1 hover:shadow-hard transition-all cursor-pointer' : '';

  return (
    <div
      ref={ref}
      className={`card-base ${paddings[padding]} ${hoverStyles} ${hoverLiftStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
