class PolyNavigationDestination {
    constructor(url) {
        this.url = url;
    }
    url;
}
class PolyNavigateEvent extends Event {
    constructor(destination, info) {
        super('navigate', { bubbles: true, cancelable: true });
        let rebased = new URL(destination, document.baseURI);
        this.canIntercept = location.protocol === rebased.protocol
            && location.host === rebased.host && location.port === rebased.port;
        this.destination = new PolyNavigationDestination(rebased.href);
        this.info = info;
    }
    destination;
    canIntercept = true;
    info;
    isIntercepted = false;
    intercept(_options) {
        this.isIntercepted = true;
        // options are ignored in this implementation, e.g. no handler or scroll
    }
    scroll(_options) {
        // not implemented
    }
}
export function registerNavigationApi() {
    if (!window.navigation) { // provide pollyfill only if not present
        // simplified version of navigation api
        window.navigation = new EventTarget();
        const oldPushState = window.history.pushState.bind(window.history);
        window.history.pushState = (f => function pushState() {
            var ret = f.apply(this, arguments);
            let url = arguments[2];
            window.navigation.dispatchEvent(new PolyNavigateEvent(url));
            return ret;
        })(window.history.pushState);
        window.addEventListener("popstate", () => {
            window.navigation.dispatchEvent(new PolyNavigateEvent(document.location.href));
        });
        let previousUrl = '';
        const observer = new MutationObserver(function () {
            if (location.href !== previousUrl) {
                previousUrl = location.href;
                window.navigation.dispatchEvent(new PolyNavigateEvent(location.href));
            }
        });
        const config = { subtree: true, childList: true };
        observer.observe(document, config);
        window.onunload = () => {
            observer.disconnect();
        };
        window.navigation.navigate = (url, options) => {
            const ev = new PolyNavigateEvent(url, options?.info);
            window.navigation.dispatchEvent(ev);
            if (ev.isIntercepted) {
                oldPushState(options?.state || {}, '', url);
            }
            else {
                window.open(url, "_self");
            }
        };
        window.navigation.back = (_options) => {
            window.history.back();
            return {
                commited: Promise.resolve(),
                finished: new Promise(resolve => setTimeout(() => resolve(), 0))
            };
        };
    }
}
