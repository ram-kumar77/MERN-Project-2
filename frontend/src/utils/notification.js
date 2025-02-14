const notification = {
  success: (message) => {
    console.log('Success:', message);
    const div = document.createElement('div');
    div.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div);
    }, 3000);
  },
  error: (message) => {
    console.error('Error:', message);
    const div = document.createElement('div');
    div.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div);
    }, 3000);
  },
  info: (message) => {
    console.info('Info:', message);
    const div = document.createElement('div');
    div.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div);
    }, 3000);
  }
};

export default notification;
