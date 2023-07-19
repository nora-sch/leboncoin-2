import { toast } from "react-toastify";

const notify = (msg, type) => {
    switch (type) {
      case "success":
        toast.success(msg, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          theme: "colored",
          className: "toast-success",
        });
        break;
      case "error":
        toast.error(msg, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          theme: "colored",
          className: "toast-error",
        });
        break;
    }
  };
export default notify;