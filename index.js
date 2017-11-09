"use strict";
const fs = require("fs"); // require File I/O
const bencode = require("bencode"); // added bencode module to parse Bencode from torrent file
const dgram = require("dgram"); // require dgram module for  udp socket connections
const Buffer = require("buffer").Buffer; // require buffer to send messages through sockets
const urlParse = require("url").parse; // parse torrent tracker url

const torrent = bencode.decode(fs.readFileSync("cat1.torrent"));
//open buffer with readFileSync and decode

const url = urlParse(torrent.announce.toString("utf8"));
// parse url and extract protocol, host, hostname, path/name & href
console.log(url);
const socket = dgram.createSocket("udp4");
// create a new udp4 socket

const myMessage = Buffer.from("Hello World!", "utf8");
// create a buffer from the string "Hello World!"

socket.send(myMessage, 0, myMessage.length, url.port, url.host, () => {});
// send message, arg1= msg as buffer, arg2+3= start of buffer and end,
// arg4+5= the port and host of reciever, arg6 = callback after send is complete

socket.on("message", msg => {
  console.log("message is ", msg);
}); // handler for console.logging incoming messages
