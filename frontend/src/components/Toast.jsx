import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseClasses = "fixed top-4 right-4 p-4 rounded shadow-lg transition-opacity duration-300";
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };

  if (!isVisible) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {message}
    </div>
  );
};

export default Toast;
