const express = require("express");
const path = require("path");

const proxy = require("http-proxy-middleware");

const http = require("http");

const app = express({
    name: "node-app",
    websocket: false
});
const environment = process.env.NODE_ENV || "production";

console.log("Environment:", environment);

var server = http.createServer(app);
var port = normalizePort(process.env.PORT || "9004");
app.set("port", port);
server.timeout = 240000;
server.listen(port);

if (environment === "development") {
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const config = require("../webpack.config.js");
    //reload=true:Enable auto reloading when changing JS files or content
    //timeout=1000:Time from disconnecting from server to reconnecting
    config.entry.app.unshift("webpack-hot-middleware/client?reload=true&timeout=1000");

    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        })
    );

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));

    app.use(express.static("./public"));
} else {
    const favicon = require("serve-favicon");
    app.use(favicon(path.join(__dirname, "public/app/img", "favicon.ico")));

    app.use(express.static("./source/public"));
}

app.use((req, res, next) => {
    res.set("X-Frame-Options", "SAMEORIGIN"); // XSS attack
    res.setHeader("X-Content-Type-Options", "nosniff"); // Preventing Content-Type Sniffing // can't chagne response type
    res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:"); // block dynamic script execution (eval) and inline scripts
    res.setHeader("Pragma", "no-cache");
    res.setHeader("X-XSS-Protection", "1");
    if (environment === "development") {
        console.log("req for", req.path);
    }
    next();
});

//  proxies
const proxyConf = require("./config/proxyConf");
// app.use('/api', proxy({ target: proxyConf, changeOrigin: true, secure: false }))
var _proxy = proxy({
    target: proxyConf,
    changeOrigin: true,
    secure: false,
    onError: onProxyError
});
app.use("/api", _proxy);

function onProxyError(err, req, res) {
    console.log("****Error:*****" + err.code);
    res.writeHead(500, {
        "Content-Type": "text/plain"
    });
    if (err.code == "ECONNREFUSED") {
        res.end("Backend service is not available. Can you please check the log for more info.");
    } else {
        res.end("Something went wrong. Can you please check the server status. " + err);
    }
}

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        msg: err.message,
        error: environment === "development" ? err : {}
    });
    next(err);
});
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
}

server.on("error", onError);
server.on("listening", onListening);

require("./api")(app);
