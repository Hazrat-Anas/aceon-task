import * as React from "react"
import Home from "./pages/Home";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./style.css"
import SignIn from "./pages/SignIn";
const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);
export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
