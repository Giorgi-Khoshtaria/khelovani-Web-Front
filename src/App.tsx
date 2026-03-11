import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import MainPage from "./page/mainPage/MainPage";
import Layout from "./layout/Layout";
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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
