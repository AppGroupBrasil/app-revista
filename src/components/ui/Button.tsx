import { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border-2 border-primary text-primary hover:bg-primary/5',
  ghost: 'text-text-light hover:text-primary hover:bg-surface-hover',
  danger: 'bg-red-50 text-red-500 hover:bg-red-100',
  accent: 'bg-accent text-white hover:bg-accent-dark',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = BaseProps & { href: string };

function classes(variant: Variant, size: Size, className: string) {
  return `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all ${variants[variant]} ${sizes[size]} ${className}`;
}

export default function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props;
  const cls = classes(variant, size, className);

  if ('href' in props && props.href) {
    return <Link href={props.href} className={cls}>{children}</Link>;
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return <button className={cls} {...rest}>{children}</button>;
}
