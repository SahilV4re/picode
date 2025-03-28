import express from "express";
const server = express();
const port = 5000;




server.listen(5000, () => {
    console.log(`server running on port ${port} `)
})

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });