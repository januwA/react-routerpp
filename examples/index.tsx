import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Routing, Routes, Link2 } from "../src/";

const dashRoutes: Routes = [
  {
    path: "x",
    component: <p>x</p>,
  },
  {
    path: "y",
    canDeactivate: [
      function exitGuard() {
        return window.confirm("exitGuard");
      },
    ],
    component: (
      <p>
        <input type="text" />
      </p>
    ),
  },
];

const Dash = (props: any) => {
  return (
    <>
      <h1>dashboard</h1>
      <ul>
        <li>
          <Link2 to="./x">to x</Link2>
        </li>
        <li>
          <Link2 to="./y">to y</Link2>
        </li>
      </ul>

      <Routing routes={dashRoutes} />
    </>
  );
};

const LzComponent = React.lazy(() => import("./lzpage"));

const Homea = () => {
  return <div> {JSON.stringify(useLocation().state as any)}</div>;
};

const routes: Routes = [
  {
    path: "",
    exact: true,
    redirectTo: "home",
  },
  {
    path: "home",
    canActivate: [
      function HomeGuard(props: any) {
        // return props.location.from;
        return true;
      },
      () => true,
      () => true,
      // () => false,
    ],
    children: [
      {
        path: "",
        exact: true,
        component: (
          <h1>
            Home
            <p>
              <Link2 to={{ pathname: "a" }}>to home/a</Link2>
            </p>
            <p>
              <Link2 to="b">to home/b</Link2>
            </p>
            <p>
              <Link2 to="/dash">to dath</Link2>
            </p>
          </h1>
        ),
      },
      {
        path: "a",
        data: { name: "home-a" },
        component: <Homea></Homea>,
      },
      {
        path: "b",
        component: (
          <Suspense fallback={<div>Loading...</div>}>
            <LzComponent />
          </Suspense>
        ),
      },
      {
        path: "*",
        component: <h1>home 404</h1>,
      },
    ],
  },
  {
    path: "dash",
    component: <Dash />,
  },
  {
    path: "login",
    component: (
      <h1>
        Login
        <p>
          <Link2 to={"/home"}>To Home</Link2>
        </p>
      </h1>
    ),
  },
  {
    path: "*",
    component: <h1 style={{ color: "red" }}>404</h1>,
  },
];

ReactDOM.render(
  <BrowserRouter>
    <Routing routes={routes} />
  </BrowserRouter>,
  document.getElementById("root")
);
