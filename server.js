/* eslint no-console:0 */
import express from "express";
import routers from "./server/src/routes/Routes";
import routeErrorHandler from "./server/src/routes/RouteErrorHandler";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import EnvironmentConfig from "./server/src/config/EnvironmentConfig";
import path from "path";
import helmet from "helmet";
import csp from "helmet-csp";
const app = express();
app.use(helmet.hidePoweredBy());
app.use(csp({ "directives": {
    "scriptSrc": ["'self'", "https://connect.facebook.net", "http://connect.facebook.net", "https://api.twitter.com"],
    "styleSrc": ["'self'", "'unsafe-inline'"]
} }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cookieParser());
app.use(helmet.xssFilter());

const ninetyDaysInMilliseconds = 7776000000;
app.use(helmet.hsts({ "maxAge": ninetyDaysInMilliseconds, "force": true }));
app.use(helmet.referrerPolicy({ "policy": "same-origin" }));

routers(app);

const DEFAULT_PORT = 5000;
const port = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("serverPort") || DEFAULT_PORT;

const clientPath = app.get("env") === "debug" ? "/dist/" : "/";
app.use(express.static(path.join(__dirname, `${clientPath}client`)));
routeErrorHandler(app);
const server = app.listen(port);
export default server;
console.log("listening on port " + port);
