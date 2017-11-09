"use strict";
const dgram = require("dgram");
const Buffer = require("buffer").Buffer;
const urlParse = require("url").parse;
const crypto = require("crypto");

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
  const buf = Buffer.alloc(16); // create empty buffer with a size of 16 bytes
  // writeUInt32BE writes an insigned 32-but int in big-endian format
  buf.writeUInt32BE(0x417, 0); // write connection id
  buf.writeUInt32BE(0x27101980, 4); // we need to write the 64-bit integer as 2 32-bit ints
  buf.writeUInt32BE(0, 8); // 0 for action in next 4 bytes, offset value - 8 since int == 8 bytes
  crypto.randomBytes(4).copy(buf, 12); // generate a random 4 byte buffer (random 32-bit int)
  // .copy to copy the buffer into out buf buffer, 12 is the offset to begin writing the random int at
  return buf;
}

function parseConnResp(resp) {
  // function to parse connection response
  return {
    action: resp.readUInt32BE(0), // read action and transactionId as unsigned 32-bit big-endian int
    transactionId: resp.readUInt32BE(4),
    connectionId: resp.slice(8) // get last 8 bytes
  };
}

function buildAnnounceReq(connId) {
  // function to build announce requests
}

function parseAnnounceResp(resp) {
  //  function to parse announce response
}
