import React, { ButtonHTMLAttributes } from 'react';

// Define interface for button props by extending ButtonHTMLAttributes
interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Add any additional props specific to your custom button
}

// Functional component for custom button
const CustomButton: React.FC<CustomButtonProps> = ({ children, ...rest }) => {
  return (
    <button  {...rest} className='bg-red-500'>
      {children}
    </button>
  );
};

export default CustomButton;
