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
import * as path from "path";
import { Link, Redirect, Route, Switch, useHistory, useLocation, useRouteMatch, } from "react-router-dom";
const pathJoin = (...paths) => {
    return paths
        .filter((p) => p)
        .join("/")
        .replace(/\/+/, "/");
};
function getRoutes(routes, root = "/") {
    const anyRoutes = [];
    for (const route of routes) {
        const abpath = pathJoin(root, route.path);
        anyRoutes.push(_jsx(Route, { exact: route.exact, path: abpath, strict: route.strict, location: route.location, sensitive: route.sensitive, render: (info) => {
                if (route.redirectTo) {
                    route.component = (_jsx(Redirect, { to: route.redirectTo[0] === "/"
                            ? route.redirectTo
                            : pathJoin(root, route.redirectTo) }, void 0));
                    return (_jsx(CanActivateRoute, { abpath: abpath, route: route, info: info }, void 0));
                }
                if (route.component || route.children) {
                    return (_jsx(CanActivateRoute, { abpath: abpath, route: route, info: info }, void 0));
                }
                return null;
            } }, abpath));
    }
    return anyRoutes;
}
function CanActivateRoute({ abpath, route, info, }) {
    var _a, _b;
    const hasCanActivate = !!((_a = route.canActivate) === null || _a === void 0 ? void 0 : _a.length);
    const [isActivate, setActivate] = useState(!hasCanActivate);
    function runGuards(guards = []) {
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
    }
    Object.assign((_b = info.location.state) !== null && _b !== void 0 ? _b : {}, route.data);
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
    return (_jsx(_Fragment, { children: isActivate ? (route.children && route.children.length ? (_jsx(Switch, { children: getRoutes(route.children, abpath) }, void 0)) : (route.component)) : null }, void 0));
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
export function Routing({ routes, root = "/", }) {
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
