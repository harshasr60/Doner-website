import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Blog } from "./pages/Blog";
import { Press } from "./pages/Press";
import { ImpactReports } from "./pages/ImpactReports";
import { Donate } from "./pages/Donate";
import { DonorWall } from "./pages/DonorWall";
import { Transparency } from "./pages/Transparency";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "blog", Component: Blog },
      { path: "press", Component: Press },
      { path: "impact-reports", Component: ImpactReports },
      { path: "donate", Component: Donate },
      { path: "donor-wall", Component: DonorWall },
      { path: "transparency", Component: Transparency },
      { path: "*", Component: NotFound },
    ],
  },
]);
