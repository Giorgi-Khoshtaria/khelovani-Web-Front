import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainPage from "./page/mainPage/MainPage";
import Layout from "./layout/Layout";
import About from "./page/about/About";
import Product from "./page/products/Product";
import Partners from "./page/partners/Partners";
import Contact from "./page/contact/Contact";
import Login from "./page/loginPage/Login";
import Registration from "./page/registration/Registration";
import PartnerRegistration from "./page/partnerRegistration/PartnerRegistration";
import UserRegistrationVerify from "./page/verifications/userRegistrationVerify/UserRegistrationVerify";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <MainPage /> },
        { path: "/about", element: <About /> },
        { path: "/products", element: <Product /> },
        { path: "/partners", element: <Partners /> },
        { path: "/contact", element: <Contact /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Registration /> },
    { path: "/become-partner", element: <PartnerRegistration /> },
    { path: "/verify-user-registration", element: <UserRegistrationVerify /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
