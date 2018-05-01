//Based on https://github.com/CIS526S18/rest-api
//Completed by Wesley Good for KSU CS526

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
  var hasCourseId = /\/courses\/\w+/;

  if(req.method === 'POST' && req.url === '/courses') {
    // CREATE a courses with JSON body
    return createCourse(req, res);

  } else if (req.method === "GET" && req.url === '/courses') {
    // READ all courses
    // res.statusCode = 400;
    // res.end("Read all courses not implemented");
    return readAllCourses(req, res);

  } else if (req.method === "GET" && hasCourseId.test(req.url)) {
    // READ a specified course
    //res.statusCode = 400;
    //res.end("Read specified course not implemented");
    return readCourse(req, res);

  } else if (req.method === "PUT" && hasCourseId.test(req.url)) {
    // UPDATE a specified course with JSON body
    // res.statusCode = 400;
    // res.end("Update a specified course not implemented");
    return updateCourse(req, res);

  } else if (req.method === "DELETE" && hasCourseId.test(req.url)) {
    // DELETE a specified course
    // res.statusCode = 400;
    // res.end("Delete a specified not implemented");

    deleteCourse(req, res);

  } else {
    // OOPS
    res.statusCode = 400;
    res.end("Oops! Not implemented");
  }
}

function createCourse(req, res) {
  var jsonString = "";

  req.on('data', function(chunk) {
    jsonString += chunk;
  });

  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });

  req.on('end', function(){
    try {
      var course = JSON.parse(jsonString);
      var tokens = course.name.split(" ");
      if(tokens.length < 2) {
        res.statusCode = 422;
        res.end("Poorly formatted course entry");
        return;
      }
      var id = tokens[0] + tokens[1];
      data["courses"][id] = course;
      save();
      res.statusCode = 200;
      res.end(id);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error: " + err);
    }
  });
}

function readAllCourses(req, res) {
  //console.log("read all courses");
  res.statusCode = 200;
  res.end(JSON.stringify(Object.values(data.courses)));
  //return;
}

function readCourse(req, res) {
  //console.log(req.url);
  var id = req.url.split('/')[2];
  //console.log("id: "+ id);
  //console.log(data.courses[id]);
  try {
    res.statusCode = 200;
    res.end(JSON.stringify(data.courses[id]));
  }
  catch (err) {
    res.statusCode = 500;
    res.end("Error: " + err);
  }

}

function updateCourse(req, res) {
  //console.log(req.url);
  var id = req.url.split('/')[2];
  //console.log("id: "+ id);
  var jsonString = "";

  req.on('data', function(chunk) {
    jsonString += chunk;
  });

  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });

  req.on('end', function(){
    //console.log(jsonString);

    try {
       var course = JSON.parse(jsonString);
       data["courses"][id] = course;
       save();
       res.statusCode = 200;
       res.end(id);
     } catch (err) {
       console.error(err);
       res.statusCode = 500;
       res.end("Server Error: " + err);
     }
  });
}

function deleteCourse(req, res) {
  try {
    var id = req.url.split('/')[2];
    delete data.courses[id];
    save();
    res.statusCode = 200;
    res.end("Deletion complete. "+id);
  } catch (err) {
    res.statusCode = 500;
    res.end("Server Error");
  }
}

/** @function load
  * Loads the persistent data file
  * @param {string} filename - the file to load
  */
function load(filename) {
  datafile = filename;
  data = JSON.parse(fs.readFileSync(filename, {encoding: "utf-8"}));
}

/** @function save
  * Saves the data to the persistent file
  */
function save() {
  fs.writeFileSync(datafile, JSON.stringify(data));
}

/** @module API
  * A module implementing a REST API
  */
module.exports = {
  load: load,
  handleRequest: handleRequest
}
