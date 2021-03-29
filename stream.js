const express = require("express");
const fs = require("fs");
const { Cipher } = require("crypto");
const app = express();

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/stream.html");
});

app.get("/Audio", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    const audioPath = "JaanBanGaye.mp3";
    const audioSize = fs.statSync("JaanBanGaye.mp3").size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, audioSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${audioSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mp3",
    };
    res.writeHead(206, headers);

    const audioStream = fs.createReadStream(audioPath, { start, end });

    audioStream.pipe(res);
});

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});