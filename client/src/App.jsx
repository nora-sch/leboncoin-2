import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/Home";
import Product from "./pages/Product";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import ConnectionModal from "./components/ConnectionModal";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import SignupValidated from "./pages/SignupValidated";

function App() {
  // Modal
  const [open, setOpen] = useState(false);
  return (
    <BrowserRouter>
      <ToastContainer />
      <NavigationBar setModalOpen={setOpen} />
      <Main>
        {/* <SideBar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/validate/:token" element={<SignupValidated setModalOpen={setOpen} /> } />
          {/* <Route
            path="/profile"
            element={
              <Auth>
                <Profile />
              </Auth>
            }
          /> */}
          {/* <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} /> */}
        </Routes>
        <ConnectionModal open={open} setModalOpen={setOpen} />
      </Main>
    </BrowserRouter>
  );
}

export default App;

const Main = styled.div``;
