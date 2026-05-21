import { ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';

const sizes: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
};

interface ContainerProps {
  size?: Size;
  className?: string;
  children: ReactNode;
}

export default function Container({ size = '4xl', className = '', children }: ContainerProps) {
  return (
    <div className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
