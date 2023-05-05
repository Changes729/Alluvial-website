import 'react-router'
import 'react-router-dom'
import {
  createBrowserRouter
} from "react-router-dom";

import NotFoundPage from "./pages/not-found";
import Uploader from './apps/uploader';
import Homepage from './pages/homepage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "/uploader",
    element: <Uploader />,
    errorElement: <NotFoundPage />,
  },
]);

export default router;