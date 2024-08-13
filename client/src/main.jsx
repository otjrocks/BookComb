import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from "./Home"
import About from './components/About';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login'
import Register from './components/Register';
import Account from './components/Account';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Bookshelf from './components/Bookshelf';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
// import dotenv from 'dotenv'

// require('dotenv').config()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: <About />,
  }, 
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/account",
    element: <Account />
  },
  {
    path: "/bookshelf/:id",
    element: <Bookshelf />
  },
  {
    path: "/forgot",
    element: <ForgotPassword />
  },
  {
    path: "/reset/:token",
    element: <ResetPassword />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
)
