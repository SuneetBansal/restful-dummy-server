#!/usr/bin/env node

// lib imports
const express = require('express');
const path = require('path');
const commander = require('commander');

// custom imports
const server = require('./server');

commander
    .option('-host, --host [host]', 'Specify host.', '')
    .option('-port, --port [port]', 'Specify port.', '')
    .option('-proxy, --proxy [proxy]', 'Specify proxy like "localhost:80".', '')
    .option('-static, --static [static]', 'Specify static files location.', '')
    .option('-config, --config [config]', 'Specify config files location.', '')
    .parse(process.argv);

const { static, config, port, host, proxy } = commander?.opts();

server.start({
    port: port,
    host: host,
    proxy: proxy,
    staticPath: static ? path.resolve(static) : undefined,
    configPath: config ? path.resolve(config) : undefined
});