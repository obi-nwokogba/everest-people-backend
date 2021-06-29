// DEPENDENCIES
// get .env variables
require("dotenv").config();

// Pull PORT from .env, give default valueof 3000
// This will work whether 3000 is free or not
const { PORT = 5000, MONGODB_URL} = process.env;

// Import Express
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");

// import

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser:true,
});

// Connection Events
// Connection Events
mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

// ============================
// MODELS
// ============================
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People",PeopleSchema);

// ============================
// MIDDLEWARE
// ============================

// To Prevent CORS Errors
app.use(cors());

// Logging
app.use(morgan("dev"));

// Parse JSON Bodies
app.use(express.json());



// Create a test route
app.get("/", (req,res) => {
    res.send("Hello SEI");
});

// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
    try {
        // Send all people
        res.json(await People.find({}));
    }
    catch(error){
        res.status(400).json(error);
    }
});


// PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
    try {
      // send all people
      res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  // PEOPLE UPDATE ROUTE
  app.put("/people/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  

// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
    try {
      res.json(await People.create(req.body))
    } catch (error) {
      res.status(400).json(error);
    }
  });


// Listener
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));