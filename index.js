"use strict";

const tracker = require("./tracker");
const torrentParser = require('./torrent-parser');
const torrent = torrentParser.open('cat1.torrent');

tracker.getPeers(torrent, peers => {
  console.log("list of peers: ", peers);
});
