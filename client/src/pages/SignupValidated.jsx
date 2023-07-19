import React from "react";
import { useNavigate } from "react-router-dom";
import notify from "../features/notify";

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
          navigate("/");
        } else {
          notify(data.error, "error");
          navigate("/");
        }
      })
      .catch((error) => {
        notify(`${error.message}`, "error");
      });
  };
  // });
  passToValidated();

  return <div></div>;
}

export default SignupValidated;
