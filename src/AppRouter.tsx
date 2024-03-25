import 'react-router'
import 'react-router-dom'
import {
  createBrowserRouter
} from "react-router-dom";

import NotFoundPage from "./pages/not-found";
import Homepage from './pages/homepage';
import ImageContainer from './apps/ImageReader';
import Doc from './apps/MarkdownReader';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
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