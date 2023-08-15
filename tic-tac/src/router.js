import { createBrowserRouter } from "react-router-dom";
import Home from "./home/Home";
import App from "./App";

export default createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        // element: token ? <Home /> : <Navigate to="/login" replace={true} />,
        element: <App />,
      },
      {
        path: "/gird",
        // element: token ? <Home /> : <Navigate to="/login" replace={true} />,
        element: <Home />,
      },
    ],
  },
]);
