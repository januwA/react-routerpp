## react-routerpp

Routing configuration based on [react-router-dom 5](https://github.com/ReactTraining/react-router)

Similar to angular routing configuration, but not very similar

## install

```
$ npm i react-routerpp
```

```tsx
import { Routing, Routes, Link2 } from "react-routerpp";

const routes: Routes = [
  {
    path: "",
    exact: true,
    redirectTo: "home",
  },
  {
    path: "home",
    children: [
      {
        path: "",
        exact: true,
        component: (
          <h1>
            Home
            <p>
              <Link2 to={{ pathname: "a", state: { a: "b" } }}>to home/a</Link2>
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
    component: <h1>Login</h1>
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
```