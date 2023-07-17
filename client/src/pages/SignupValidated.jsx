import React from "react";
import { useNavigate } from "react-router-dom";
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

function SignupValidated({ setModalOpen }) {
  const navigate = useNavigate();
  const passToValidated = () => {
    fetch(`/api/validate/${window.location.pathname.split("/").at(-1)}`, {
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          setModalOpen(true);
          notify(data.message, "success");
          navigate("/");
        } else if (data.status === 404) {
          notify(data.error, "error");
        } else {
          notify(data.error, "error");
        }
      })
      .catch((error) => {
        notify(`${error.message}`, "error");
      });
  };
  // });
  passToValidated();

  return <div>SignupValidated</div>;
}

export default SignupValidated;
