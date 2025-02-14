import React from 'react';
import ReactDOM from 'react-dom';
import Toast from '../components/Toast';

let toastContainer = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

export const showToast = (message, type = 'success', duration = 3000) => {
  const container = createToastContainer();
  const toastElement = document.createElement('div');
  container.appendChild(toastElement);

  const removeToast = () => {
    ReactDOM.unmountComponentAtNode(toastElement);
    container.removeChild(toastElement);
  };

  ReactDOM.render(
    <Toast
      message={message}
      type={type}
      duration={duration}
      onClose={removeToast}
    />,
    toastElement
  );
};

export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  info: (message, duration) => showToast(message, 'info', duration)
};
