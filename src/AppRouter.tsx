import 'react-router'
import 'react-router-dom'
import {
  createBrowserRouter
} from "react-router-dom";

import NotFoundPage from "./pages/not-found";
import Uploader from './apps/uploader';
import Homepage from './pages/homepage';
import ImageContainer from './apps/ImageReader';
import Doc from './apps/MarkdownReader';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "/uploader/",
    element: <Uploader />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/images/*",
    element: <ImageContainer/>,
  },
  {
    path: "/doc/*",
    element: <Doc/>,
  }
]);

export default router;