import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import MainPage from "./page/mainPage/MainPage";
import Layout from "./layout/Layout";
import About from "./page/about/About";
import Product from "./page/products/Product";
import Partners from "./page/partners/Partners";
import Contact from "./page/contact/Contact";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainPage />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/products",
          element: <Product />,
        },
        {
          path: "/partners",
          element: <Partners />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
