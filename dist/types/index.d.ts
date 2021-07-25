import React from "react";
import { LinkProps, RouteComponentProps } from "react-router-dom";
export declare type Data = {
    [name: string]: any;
};
export declare type Guard = (props: RouteComponentProps<{
    [x: string]: string | undefined;
}>) => boolean | string | Promise<boolean | string>;
export interface IRoute {
    path?: string;
    exact?: boolean;
    component?: React.ReactNode;
    redirectTo?: string;
    canActivate?: Guard[];
    CanActivateChild?: Guard[];
    canDeactivate?: Guard[];
    canLoad?: any[];
    data?: Data;
    children?: Routes;
    loadChildren?: () => Promise<React.ReactNode>;
    runGuardsAndResolvers?: any;
    strict?: boolean;
    location?: any;
    sensitive?: boolean;
}
export declare type Routes = IRoute[];
export declare function Link2<S = unknown>(props: LinkProps<S> & React.RefAttributes<HTMLAnchorElement>): JSX.Element;
export declare function Routing({ routes, root, }: {
    routes: Routes;
    root?: string;
}): JSX.Element;
//# sourceMappingURL=index.d.ts.map