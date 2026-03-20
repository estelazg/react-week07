import { createHashRouter } from "react-router-dom";

import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import Cart from "./views/front/Cart";
import Checkout from "./views/front/Checkout";
import NotFound from "./views/front/NotFound";
import Login from "./views/Login";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <SingleProduct /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
