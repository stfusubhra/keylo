import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-label-caps transition-all border-2';

  const variants = {
    primary: 'bg-acid-lime border-primary text-primary hover:-translate-y-1 hover:shadow-hard',
    secondary: 'bg-surface-container-lowest border-primary text-primary hover:-translate-y-1 hover:shadow-hard',
    ai: 'bg-electric-purple border-primary text-white hover:-translate-y-1 hover:shadow-hard',
    ghost: 'bg-transparent border-transparent text-on-surface-variant hover:text-primary hover:border-primary',
    danger: 'bg-coral border-primary text-white hover:-translate-y-1 hover:shadow-hard',
    outline: 'bg-transparent border-primary text-primary hover:bg-primary hover:text-on-primary',
  };

  const sizes = {
    sm: 'px-md py-sm text-label-caps',
    md: 'px-lg py-md text-label-caps',
    lg: 'px-xl py-lg text-h3',
    xl: 'px-[40px] py-lg text-h3',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="material-symbols-outlined">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="material-symbols-outlined">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
