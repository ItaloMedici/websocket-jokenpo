import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
// import { Container } from './styles';

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
};

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col w-64">
      <label className="text-white mb-2 font-bold">{label}</label>
      <input
        className="
          text-white placeholder:text-white80 bg-primary500 rounded-lg border 
          border-primary100 p-2 outline-none transition-all
          focus:outline-primary100A outline-3 outline-offset-1 
          disabled:bg-primary300 disabled:border-primary200 disabled:placeholder:text-white60 disabled:text-white60
        "
        {...props}
      />
    </div>
  );
};

export default Input;
