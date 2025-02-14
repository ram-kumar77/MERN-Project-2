import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const alert = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  }
};

export { alert };