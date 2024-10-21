import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position= "top-right"
        autoClose= {2000} 
        hideProgressBar= {true}
        closeOnClick= {true}
        pauseOnHover= {false}
        draggable= {false}
        progress= {undefined}
        theme= "light" 
      />
    </>
  );
};

export default ToastProvider;