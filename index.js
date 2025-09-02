const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();
const Person = require("./models/person");

const app = express();

const { StatusCodes } = require("http-status-codes");

app.use(express.json());

app.use(morgan("tiny"));

app.use(
  cors({
    origin: [" http://localhost:5173/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//configuration du midleware morgan pour pouvoir renvoyer les donnes du body dan sla console

morgan.token("postToken", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "-";
});

//utilisation du token dans le format morgan

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postToken"
  )
);
console.log("list des persons");
app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

// app.get("/info", (request, response) => {
//   const time = new Date();
//   const nbrePeople = persons.length;
//   const result = `<p>PhoneBook has info for ${nbrePeople} people</p>
//    <p>${time}</p>`;

//   response.send(result);
// });

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   const person = persons.filter((person) => person.id !== id);
//   if (person) return response.json(person);
//   response.status(StatusCodes.NO_CONTENT).end();
// });

// const generateID = (persons, min = 1, max = 1000000) => {
//   const existsId = new Set(persons.map((pers) => pers.id));
//   let id;

//   do {
//     id = Math.floor(Math.random() * (max - min + 1)) + min;
//   } while (existsId.has(id));

//   return id;
// };

app.post("/api/persons", (request, response) => {
  console.log("hello");
  const body = request.body;

  const exitsName = persons.some((person) => person.name === body.name);
  //verifier si le numero exits deja

  if (!body.name || !body.number)
    return response.status(400).json({ error: "name or number missing" });

  //verifier si un non exists deja

  if (exitsName)
    return response
      .status(400)
      .json({ error: `${body.name} already exists in the phonebook` });

  const newPerson = new person({
    name: body.name,
    number: body.number,
  });
  newPerson.save().then((savedPerson) => {
    response.status(201).json(savedPerson);
  });
  //   .catch((error) => next(error));
  // response.status(201).json(newPerson);
});

//midleware pour gerer les routes inexistantes

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);

const PORT = process.env.MONGODB_URI;
app.listen(PORT, () => {
  console.log(`server runing on port ${PORT}`);
});
