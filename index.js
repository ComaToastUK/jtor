"use strict";
const fs = require("fs");
const torrent = fs.readFileSync("cat.torrent");
console.log(torrent.toString("utf8"));
