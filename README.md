## react-routerpp

Routing configuration based on [react-router-dom 5](https://github.com/ReactTraining/react-router)

Similar to angular routing configuration, but not very similar

## install

```
$ npm i react-routerpp
```

```tsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Routing, Routes, Link2 } from "react-routerpp";

const LzPage = React.lazy(() => import("./lzpage"));

const LzComponent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LzPage></LzPage>
    </Suspense>
  );
};

const Homea = () => {
  return <div> {JSON.stringify(useLocation().state as any)}</div>;
};

const Home = () => {
  return (
    <h1>
      Home
      <p>
        <Link2 to={{ pathname: "a" }}>to home/a</Link2>
      </p>
      <p>
        <Link2 to="b">to home/b</Link2>
      </p>
    </h1>
  );
};

const Login = () => {
  return (
    <h1>
      Login
      <p>
        <Link2 to={"/home"}>To Home</Link2>
      </p>
    </h1>
  );
};

class NotFound extends React.Component {
  render() {
    return <h1 style={{ color: "red" }}>404</h1>;
  }
}

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
        component: Home,
      },
      {
        path: "a",
        data: { name: "home-a" },
        component: Homea,
      },
      {
        path: "b",
        component: LzComponent,
      },
    ],
  },
  {
    path: "login",
    component: Login,
  },
  {
    path: "*",
    component: NotFound,
  },
];

ReactDOM.render(
  <BrowserRouter>
    <Routing routes={routes} />
  </BrowserRouter>,
  document.getElementById("root")
);
```