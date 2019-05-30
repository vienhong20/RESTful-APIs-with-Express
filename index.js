//Build a web server
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json()); //middle ware

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

//Call back function || Route handler
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses); //connect to the database
});

//handling HTTP GET requests (single id)
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");
  res.send(course);
});

//handling HTTP POST requests (POSTMAN)
app.post("/api/courses", (req, res) => {
  //input validation  (JOI)
  const { error } = validateCourse(req.body);
  //if not validate, return 400
  if (error) return res.status(400).send(error.details[0].message);
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  //post and return the update course
  courses.push(course);
  res.send(course);
});

//handling HTTP PUT requests
app.put("/api/courses/:id", (req, res) => {
  //look up the course
  const course = courses.find(c => c.id === parseInt(req.params.id));
  //if not existing, return 404
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");
  const { error } = validateCourse(req.body); //result.error
  //if not validate, return 400
  if (error) return res.status(400).send(error.details[0].message);
  //update course
  course.name = req.body.name;
  //return the updated course
  res.send(course);
});

//handling HTTP DELETE requests
app.delete("/api/courses/:id", (req, res) => {
  //look up the course
  const course = courses.find(c => c.id === parseInt(req.params.id));
  //if not existing, return 404
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");
  //delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //return the same course
  res.send(course);
});

//function to handle the VALIDATION LOGIC
function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

//App listen on the port#, PORT=localhost
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port ${port}..."));
