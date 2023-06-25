#!/usr/bin/env node

const express = require('express');
// const yargs = require('yargs');
const path = require('path');
const commander = require('commander');

//const app = express();
const server = require('./server');

commander
    .option('-host, --host [host]', 'Specify host.', '')
    .option('-port, --port [port]', 'Specify port.', '')
    .option('-proxy, --proxy [proxy]', 'Specify proxy like "localhost:80".', '')
    .option('-static, --static [static]', 'Specify static files location.', '')
    .option('-config, --config [config]', 'Specify config files location.', '')
    .parse(process.argv);

// const { static, config, port, host, proxy } = yargs
// .usage('mock-server [options]')
// .options({
//     host: {
//         alias: 'h',
//         description: 'Set host'
//     },
//     port: {
//         alias: 'P',
//         description: 'Set port'
//     },
//     proxy: {
//         alias: 'p',
//         description: 'Set proxy'
//     },
//     watch: {
//         alias: 'w',
//         description: 'Watch files'
//     },
//     static: {
//         alias: 's',
//         description: 'Static files path'
//     },
//     config: {
//         alias: 'c',
//         description: 'Config file path'
//     }
// }).argv;

const { static, config, port, host, proxy } = commander?.opts();

server.start({
    port: port,
    host: host,
    proxy: proxy,
    staticPath: static ? path.resolve(static) : undefined,
    configPath: config ? path.resolve(config) : undefined
});