const fs = require('fs');

// Module variables
var data = {};
var datafile = "";

/** @function handleRequest
  * This function maps incoming requests to
  * API calls.
  * TODO set up mapping.
  * @param {http.clientRequest} req - the incoming request
  * @param {http.serverResponse} res - the response to serve
  */
function handleRequest(req, res) {
  res.statusCode = 400;
  res.end("Not implemented");
}

/** @function load
  * Loads the persistent data file
  * @param {string} filename - the file to load
  */
function load(filename) {
  datafile = filename;
  var data = JSON.parse(fs.readFileSync(filename, {encoding: "utf-8"}));
}

/** @function save
  * Saves the data to the persistent file
  */
function save() {
  fs.writeFile(filename, JSON.stringify(data));
}

/** @module API
  * A module implementing a REST API
  */
module.exports = {
  load: load,
  handleRequest: handleRequest
}
