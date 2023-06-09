// Backend --> To import Packages, we use require.
// React --> To import Packages, we use import.

const router = require("express").Router();

const mongoose = require("mongoose");

// Require Data Models
const Event = require("../models/Event.model");
const Detail = require("../models/Details.model");
const fileUploader = require("../config/cloudinary.config");

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  res.json({ fileUrl: req.file.path });
});

// POST /api/events ROUTE that Creates a new event
router.post("/events", async (req, res) => {
  const { title, description, imageUrl, information } = req.body;

  try {
    // We wait until we have the status of the creation of Event to make the next step
    let response = await Event.create({
      title,
      description,
      imageUrl,
      information,
      details: [],
    });
    // Send the response as a json file, because we're making an API
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

// GET /api/events ROUTE that Lists the events
router.get("/events", async (req, res) => {
  try {
    let allEvents = await Event.find().populate("details");
    res.json(allEvents);
  } catch (error) {
    res.json(error);
  }
});

// GET /api/events/:eventId to display specific info of a Event
router.get("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    // status of 2xx is successful.
    // error with 4xx is client-side.
    // error with 5xx is server-side
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    let foundEvent = await Event.findById(eventId).populate("details");
    res.status(200).json(foundEvent);
  } catch (error) {
    res.json(error);
  }
});

// PUT /api/events/:eventId to update info of a Event

router.put("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { title, description, information } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  try {
    let updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, description, information },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  try {
    await Event.findByIdAndRemove(eventId);
    res.json({ message: `Event with ${eventId} is removed.` });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
