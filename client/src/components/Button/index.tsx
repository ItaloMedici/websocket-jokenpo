import React from 'react';

// import { Container } from './styles';

type ButtonProps =  React.PropsWithChildren<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button className={'flex gap-2 items-center bg-secondary py-2 px-3 rounded-md text-primary font-black text-sm h-10  transition-shadow shadow-md hover:shadow-secondaryA'+(className??"")} {...props}>
      {children}
    </button>
  );
}

export default Button;  