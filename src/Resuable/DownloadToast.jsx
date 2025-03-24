import { useEffect, useRef } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DownloadToast = ({downloadloading}) => {
    const isComponentMounted = useRef(true);
    const downloadingToastId = useRef(null);
    useEffect(() => {
        const displayDownloadingToast = () => {
          downloadingToastId.current = toast.info("Downloading..., It may take longer time..., Do not Refresh  page ", { autoClose: false, draggable: false });
        }; 
        if (isComponentMounted.current && downloadloading) {
          displayDownloadingToast();
          isComponentMounted.current = false;
        } else if (!downloadloading && downloadingToastId.current !== null) {
          toast.success("Download complete", { autoClose: 5000, onClose: () => toast.dismiss(downloadingToastId.current) });
          downloadingToastId.current = null;
        } else if (downloadloading && downloadingToastId.current === null) {
          displayDownloadingToast();
        }
    
        return () => {
          toast.dismiss(downloadingToastId.current);
        };
      }, [downloadloading]);
    
      return (
        <div>
            <ToastContainer/>
        </div>
      ); 


      
    };

    


export default DownloadToast
