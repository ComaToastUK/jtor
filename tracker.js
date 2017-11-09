"use strict";
const dgram = require("dgram");
const Buffer = require("buffer").Buffer;
const urlParse = require("url").parse;

module.exports.getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4"); // create udp4 socket
  const url = torrent.announce.toString("utf8"); // get tracker url as a string

  udpSend(socket, buildConnReq(), url); // send connection request to the tracker url
  socket.on("message", response => {
    if (respType(response) === "connect") {
      // if we receive a connect response
      const connResp = parseConnResp(response); // parse the connect response
      const announceReq = buildAnnounceReq(connResp.connectionId); // create announce request
      udpSend(socket, announceReq, url); // send announce request back
    } else if (respType(response) === "announce") {
      // else if we receive an annunce response
      const announceResp = parseAnnounceResp(response); // parse the announce response
      callback(announceResp.peers); // pass peers to callback
    }
  });
};

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
} // call socket send with whole buffer with default callback of null func

function respType(resp) {
  // function to check if response is connect or announce request
}

function buildConnReq() {
  // function to build connection request
}

function parseConnResp(resp) {
  // function to parse connection response
}

function buildAnnounceReq(connId) {
  // function to build announce requests
}

function parseAnnounceResp(resp) {
  //  function to parse announce response
}
