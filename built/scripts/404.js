import stuff from "../config/stuff.js";
import Router from "./components/router.js";
console.log("boop");
const router = new Router();
router
    .config(
/* options= */ {
    mode: "history",
    root: stuff.url_path_root
})
    .add(/^novel\/potato$/, router.getHtmlCallback(
/* htmlPath= */ `${window.location.origin}/${stuff.url_path_root}/overview.html`))
    .add(/^novel\/(.*)$/, router.getHtmlCallback(
/* htmlPath= */ `${window.location.origin}/${stuff.url_path_root}/novel-overview.html`));
router.check(router.getFragment());
//router.listen();
//router.navigate(
//    /* urlpath= */window.location.pathname
//);
