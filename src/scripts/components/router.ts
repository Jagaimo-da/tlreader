interface Route {
    re: string | RegExp,
    handler: Function
}

class Router {
    constructor(
        public routes: Array<Route> = [],
        public mode: string = null,
        public root: string = '/',
        public interval: NodeJS.Timeout = null
    ) {
        this.routes = routes; // keeps the current registered routes
        this.mode = mode; // could be 'hash' or 'history' showing if we use the History API or not
        this.root = root; // the root URL path of the application; needed only if using pushState
        this.interval = interval;
    }
    
    config(
        options?: {
            mode: string,
            root: string
        }
    ) {
        this.mode = options && options.mode && options.mode == 'history' 
                    && !!(history.pushState) ? 'history' : 'hash';
        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
        return this;
    }

    getFragment() {
        console.log("getting fragment");
        let fragment = '';
        console.log(`frag init: ${fragment}`);
        if (this.mode === 'history') {
            fragment = decodeURI(window.location.pathname);
            console.log(`frag pathDecoded: ${fragment}`);
            console.log(`frag rootToReplace: ${this.root}`);
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
            console.log(`frag replacedRoot: ${fragment}`);
        }
        else {
            const match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }
        
        console.log(`frag return: ${this.clearSlashes(fragment)}`);
        return this.clearSlashes(fragment);
    }

    clearSlashes(pathstr: string) {
        return pathstr.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    add(
        re: RegExp | string,
        handler: () => any
    ) {
        if (typeof re == 'function') {
            handler = re;
            re = '';
        }
        this.routes.push(
            {
                "re": re,
                "handler": handler
            }
        );
        return this;
    }

    remove(
        param: RegExp | string | (() => any)
    ) {
        for (const [index, route] of this.routes.entries()) {
            if (route.handler === param || route.re.toString() === param.toString()) {
                this.routes.splice(index, 1); 
                return this;
            }
        }
        return this;
    }

    flush() {
        this.routes = [];
        this.mode = null;
        this.root = '/';
        return this;
    }

    check(f: string) {
        console.log(`fragment: ${f}`);
        console.log(`href: ${window.location.href}`);
        console.log(`origin: ${window.location.origin}`);
        console.log(`pathname: ${window.location.pathname}`);
        console.log(`set root: ${this.root}`);
        const fragment = f || this.getFragment();
        for (const [index, route] of this.routes.entries()) {
            const match = fragment.match(route.re);
            if (match) {
                match.shift();
                route.handler.apply(
                    /* thisArg= */ {},
                    /* argArray */ match
                );
                return this;
            }           
        }
        return this;
    }

    listen() {
        const self = this;
        let current = self.getFragment();
        const fn = function() {
            console.log("hey! listen");
            if (current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        }
        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);
        return this;
    }

    navigate(urlpath: string) {
        console.log(`urlpath="${urlpath}"`);
        console.log(`pushstate url = ${this.root + this.clearSlashes(urlpath)}`);
        urlpath = urlpath ? urlpath : '';
        if (this.mode === 'history') {
            history.pushState(
                /* data= */ null,
                /* unused= */ null,
                /* url= */ "/" + this.clearSlashes(urlpath)
            );
        }
        else {        
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + urlpath;
        }
        
        return this;
    }

    getHtmlCallback(htmlPath: string) {
        return async () => {
            const response = await fetch(htmlPath);
            const overviewHtml = await response.text();
            document.open();
            document.write(overviewHtml);
            document.close();
        };
    }
};

export default Router;
