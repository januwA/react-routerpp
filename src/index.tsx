import React, { useEffect } from "react";
import { useState } from "react";
import * as path from "path";
import {
  Link,
  LinkProps,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

/**
 * 表示与特定路由关联的静态数据。
 */
export type Data = {
  [name: string]: any;
};

export type Guard = (
  props: RouteComponentProps<{
    [x: string]: string | undefined;
  }>
) => boolean | string | Promise<boolean | string>;

export interface IRoute {
  // default '/'
  path?: string;

  // full match ?
  exact?: boolean;

  /**
   * 路径匹配时要实例化的组件
   * 如果子路由指定组件，则可以为空
   *
   * ! 当同时拥有component和children时，component无效
   */
  component?: React.ReactNode;

  /**
   * 当路径匹配时重定向到的 URL
   *
   * 如果 URL 以斜杠 (/) 开头，则为绝对值，否则相对于路径 URL
   */
  redirectTo?: string;

  /**
   * 处理程序，以确定是否允许当前用户激活组件
   *
   * 默认情况下，任何用户都可以激活组件的子组件
   *
   * 守卫返回fasle时，访问当前路由和子路由都会触发
   * 守卫返回true时， 访问当前路由会触发,子路由不会触发
   */
  canActivate?: Guard[];

  /**
   * ! 未实现
   */
  CanActivateChild?: Guard[];

  /**
   * 处理程序，以确定是否允许当前用户停用组件
   *
   * 默认情况下，任何用户都可以激活停用
   */
  canDeactivate?: Guard[];

  /**
   * 处理程序，以确定是否允许当前用户加载组件
   *
   * 默认情况下，任何用户都可以加载
   *
   *  ! 未实现
   */
  canLoad?: any[];

  /**
   * 通过以下方式提供给组件的其他开发人员定义的数据
   *
   * 默认情况下，不传递其他数据
   *
   * data 会被合并到 useLocation().state
   */
  data?: Data;

  /**
   * 指定嵌套路由的子 `Route` 对象数组配置
   */
  children?: Routes;

  /**
   * 指定延迟加载的子路由的对象
   *
   * ! 为实现
   *
   * 使用react的方法懒加载
   *
   * https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy
   *
   * https://github.com/jamiebuilds/react-loadable
   *
   */
  loadChildren?: () => Promise<React.ReactNode>;

  /**
   * 定义何时运行守卫和解析器
   *
   * - `paramsOrQueryParamsChange`：当查询参数改变时运行
   * - `always`：在每次执行时运行
   *
   * 默认情况下，只有当路由的矩阵参数发生变化时，守卫和解析器才会运行
   *
   * ! 为实现
   */
  runGuardsAndResolvers?: any;

  /**
   * react Route 参数
   *
   */
  strict?: boolean;

  /**
   * react Route 参数
   */
  location?: any;

  /**
   * react Route 参数
   *
   * 默认path不区分大小写匹配
   */
  sensitive?: boolean;
}

export type Routes = IRoute[];

const pathJoin = (...paths: (string | undefined)[]) => {
  return paths
    .filter((p) => p)
    .join("/")
    .replace(/\/+/, "/");
};

function getRoutes(routes: Routes, root = "/"): Route[] {
  const anyRoutes: any[] = [];

  for (const route of routes) {
    const abpath = pathJoin(root, route.path);

    anyRoutes.push(
      <Route
        key={abpath}
        exact={route.exact}
        path={abpath}
        strict={route.strict}
        location={route.location}
        sensitive={route.sensitive}
        render={(info) => {
          if (route.redirectTo) {
            route.component = (
              <Redirect
                to={
                  route.redirectTo![0] === "/"
                    ? (route.redirectTo as string)
                    : pathJoin(root, route.redirectTo)
                }
              />
            );
            return (
              <CanActivateRoute abpath={abpath} route={route} info={info} />
            );
          }

          if (route.component || route.children) {
            return (
              <CanActivateRoute abpath={abpath} route={route} info={info} />
            );
          }

          return null;
        }}
      />
    );
  }

  return anyRoutes;
}

function CanActivateRoute({
  abpath,
  route,
  info,
}: {
  abpath: string;
  route: IRoute;
  info: RouteComponentProps<{
    [x: string]: string | undefined;
  }>;
}) {
  const hasCanActivate = !!route.canActivate?.length;
  const [isActivate, setActivate] = useState(!hasCanActivate);

  function runGuards(guards: Guard[] = []): Promise<boolean | string> {
    return new Promise<boolean | string>(async (res) => {
      if (!guards.length) return res(true);
      let r = guards[0](info);
      if (r === true) res(runGuards(guards.slice(1)));
      if (r === false) res(false);
      if (typeof r === "string") res(r);
      if (Object.prototype.toString.call(r) === "[object Promise]") {
        r = await (r as Promise<boolean>);
        if (r === true) res(runGuards(guards.slice(1)));
        if (r === false) res(false);
        if (typeof r === "string") res(r);
      }

      res(false);
    });
  }

  Object.assign(info.location.state ??= {}, route.data);

  useEffect(() => {
    (info.location as any).from ??= "";
    if (hasCanActivate) {
      runGuards(route.canActivate).then((activate) => {
        if (typeof activate === "string") {
          return info.history.replace(activate);
        }
        setActivate(activate as boolean);
        if (!activate) {
          if ((info.location as any).from?.length ?? false) {
            info.history.goBack();
          }
        }
      });
    }
    return () => {
      runGuards(route.canDeactivate).then((activate) => {
        if (typeof activate === "string") {
          return info.history.replace(activate);
        }

        if (activate === false) info.history.goBack();
      });
    };
  }, []);

  return (
    <>
      {isActivate ? (
        route.children && route.children.length ? (
          <Switch>{getRoutes(route.children, abpath)}</Switch>
        ) : (
          route.component
        )
      ) : null}
    </>
  );
}

export function Link2<S = unknown>(
  props: LinkProps<S> & React.RefAttributes<HTMLAnchorElement>
) {
  const isStr = typeof props.to === "string";

  const _path: string = isStr
    ? (props.to as string)
    : ((props.to as Location).pathname as string);

  const abpath: string = path.isAbsolute(_path)
    ? _path
    : path.resolve(useRouteMatch().path, _path);

  return (
    <Link
      {...props}
      to={isStr ? abpath : { ...(props.to as any), pathname: abpath }}
    ></Link>
  );
}

export function Routing({
  routes,
  root = "/",
}: {
  routes: Routes;
  root?: string;
}) {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    const unlisten = history.listen(function (to) {
      // console.log("from", location.pathname);
      // console.log('to', to.pathname);
      (to as any).from = location.pathname;
    });
    return () => {
      unlisten();
    };
  }, []);
  return <Switch>{getRoutes(routes, root)}</Switch>;
}
