var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Redirect, Route, Switch, useHistory, useLocation, useRouteMatch, } from "react-router-dom";
const path = {
    join(...paths) {
        return paths
            .filter((p) => p)
            .join("/")
            .replace(/\/+/, "/");
    },
    isAbsolute(p) {
        return p.trimStart().startsWith("/");
    },
    resolve(...paths) {
        const cpath = paths.join("/");
        const isABpath = cpath.trimStart().startsWith("/");
        const rpaths = cpath
            .split(/\/+/)
            .filter((it) => it)
            .reduce((acc, it) => {
            if (it === "..")
                return acc.pop(), acc;
            if (it === ".")
                return acc;
            return acc.push(it), acc;
        }, []);
        return (isABpath ? "/" : "") + rpaths.join("/");
    },
};
function getRoutes(routes, root = "/") {
    return routes.map((route) => {
        const abpath = path.join(root, route.path);
        return (_jsx(Route, { exact: route.exact, path: abpath, strict: route.strict, location: route.location, sensitive: route.sensitive, render: (rinfo) => {
                if (route.redirectTo) {
                    route.component = () => (_jsx(Redirect, { to: path.isAbsolute(route.redirectTo)
                            ? route.redirectTo
                            : path.join(root, route.redirectTo) }, void 0));
                    return (_jsx(CanActivateRoute, { abpath: abpath, route: route, info: rinfo }, void 0));
                }
                if (route.component || route.children) {
                    return (_jsx(CanActivateRoute, { abpath: abpath, route: route, info: rinfo }, void 0));
                }
                return null;
            } }, abpath));
    });
}
function CanActivateRoute({ abpath, route, info, }) {
    var _a, _b, _c;
    var _d;
    const hasCanActivate = !!((_a = route.canActivate) === null || _a === void 0 ? void 0 : _a.length);
    const [isActivate, setActivate] = useState(!hasCanActivate);
    const runGuards = (guards = []) => {
        return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
            if (!guards.length)
                return res(true);
            let r = guards[0](info);
            if (r === true)
                res(runGuards(guards.slice(1)));
            if (r === false)
                res(false);
            if (typeof r === "string")
                res(r);
            if (Object.prototype.toString.call(r) === "[object Promise]") {
                r = yield r;
                if (r === true)
                    res(runGuards(guards.slice(1)));
                if (r === false)
                    res(false);
                if (typeof r === "string")
                    res(r);
            }
            res(false);
        }));
    };
    Object.assign(((_b = (_d = info.location).state) !== null && _b !== void 0 ? _b : (_d.state = {})), route.data);
    useEffect(() => {
        var _a;
        var _b;
        (_a = (_b = info.location).from) !== null && _a !== void 0 ? _a : (_b.from = "");
        if (hasCanActivate) {
            runGuards(route.canActivate).then((activate) => {
                var _a, _b;
                if (typeof activate === "string") {
                    return info.history.replace(activate);
                }
                setActivate(activate);
                if (!activate) {
                    if ((_b = (_a = info.location.from) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : false) {
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
                if (activate === false)
                    info.history.goBack();
            });
        };
    }, []);
    const Comp = route.component;
    return (_jsx(_Fragment, { children: isActivate ? (((_c = route.children) === null || _c === void 0 ? void 0 : _c.length) ? (_jsx(Switch, { children: getRoutes(route.children, abpath) }, void 0)) : Comp ? (_jsx(Comp, {}, void 0)) : null) : null }, void 0));
}
export function Link2(props) {
    const isStr = typeof props.to === "string";
    const _path = isStr
        ? props.to
        : props.to.pathname;
    const abpath = path.isAbsolute(_path)
        ? _path
        : path.resolve(useRouteMatch().path, _path);
    return (_jsx(Link, Object.assign({}, props, { to: isStr ? abpath : Object.assign(Object.assign({}, props.to), { pathname: abpath }) }), void 0));
}
export function Routing({ routes, root }) {
    const match = useRouteMatch();
    root !== null && root !== void 0 ? root : (root = match.path);
    const history = useHistory();
    const location = useLocation();
    useEffect(() => {
        const unlisten = history.listen(function (to) {
            to.from = location.pathname;
        });
        return () => {
            unlisten();
        };
    }, []);
    return _jsx(Switch, { children: getRoutes(routes, root) }, void 0);
}
