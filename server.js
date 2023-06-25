// lib imports
const express = require('express');
const path = require('path');
const fs = require('fs');
const httpProxy = require('express-http-proxy');

// custom imports
const app = express();
const defaultServerSetting = require('./default-server-setting');
const utils = require('./utils');

/**
 * to start express server with provided configuration
 * 
 * @param {*} serverSettings 
 */
function start(serverSettings) {
    const { staticPath, configPath, ...others } = serverSettings;
    const { port, host, proxy } = others;

    // merging user server settings with default server settings
    const options = Object.assign({}, defaultServerSetting, serverSettings);

    app.set('options', options);

    app.use(function(req, res, next) {
        const result = utils.getMatchingDummyData(req, configPath);
        const { response: defaultResponse } = app.get('options');

        if (result?.response) {
            const { body, headers: responseHeaders, delay } = result?.response;
            const headers = { ...defaultResponse?.headers,  ...responseHeaders };

            res.set(headers);
            res.status(200);

            setTimeout(() => {
                try {
                    if (typeof body === 'string') {
                        const filePath = path.join(configPath, body);
                        const fileStat = fs.statSync(filePath);
    
                        if (fileStat.isFile()) {
                            res.sendFile(filePath);
                        } else {
                            res.send(body);
                        }
                    } else {
                        res.send(body);
                    }
                } catch (e) {
                    res.send(body);
                }
            }, delay ?? 0);
        } else if (proxy) {
            next();
        } else {
            res.status(404);
            res.send({ 'message': 'not found' });
        }
    });

    // adding proxy middleware which would work when no response is found and proxy is configured
    if (proxy) {
        app.use(
            httpProxy(proxy, {
                proxyReqPathResolver: function (req) {
                    return req.url;
                }
            })
        );
    }

    app.listen(port, host, () => {
        console.log('Mock server started at ' + port);
    });
}

module.exports = {
    start
};
