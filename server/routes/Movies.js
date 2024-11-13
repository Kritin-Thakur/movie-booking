const express = require("express");
const router = express.Router();
const { Movies } = require('../models') // The value at const needs to be the same as the name of the model



router.get("/showmovies", async(req, res) => {
    const listOfMovies = await Movies.findAll();
    res.json(listOfMovies);
});

router.post("/addmovie", async (req, res) => {
    const newMovie = req.body;
    await Movies.create(newMovie);
    res.json(req.body);
});

module.exports = router;
