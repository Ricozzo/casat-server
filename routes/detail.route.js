const router = require('express').Router();

const mongoose = require('mongoose');

const Event = require('../models/Event.model');
const Detail = require('../models/Details.model');


// POST '/api/details' route to Create a New Detail
router.post('/details', async(req,res)=>{
    const {title, description, eventId } = req.body; 

    try{
        // Create a New Detail
        let newDetail = await Detail.create({title, description, event: eventId});

        // Push a New Detail to a Event
        let response = await Event.findByIdAndUpdate(eventId, {$push: {details: newDetail._id}});

        res.json(response);
    }
    catch(error){
        res.json(error);
    }
});

module.exports = router;