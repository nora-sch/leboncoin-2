import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Dashboard from "./pages/Dashboard";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import ConnectionModal from "./components/ConnectionModal";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import SignupValidated from "./pages/SignupValidated";
import Auth from "./Auth";
import AddProductModal from "./components/AddProductModal";

function App() {
  // Modal
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <ToastContainer />
      <NavigationBar
        setSignInModalOpen={setSignInModalOpen}
        setAddProductModalOpen={setAddProductModalOpen}
      />
      <Main>
        {/* <SideBar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<Product />} />
          <Route
            path="/validate/:token"
            element={<SignupValidated setModalOpen={setSignInModalOpen} />}
          />
          <Route
            path="/dashboard"
            element={
              <Auth>
                <Dashboard />
              </Auth>
            }
          />
        </Routes>
        <ConnectionModal
          open={signInModalOpen}
          setModalOpen={setSignInModalOpen}
        />
        <AddProductModal
          open={addProductModalOpen}
          setModalOpen={setAddProductModalOpen}
        />
      </Main>
    </BrowserRouter>
  );
}

export default App;

const Main = styled.div``;
