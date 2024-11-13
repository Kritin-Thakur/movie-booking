const express = require("express");
const router = express.Router();
const { Movie } = require('../models') // The value at const needs to be the same as the name of the model
const { Op } = require("sequelize");




router.get("/showmovies", async(req, res) => {
    const listOfMovies = await Movie.findAll();
    res.json(listOfMovies);
});

router.post("/addmovie", async (req, res) => {
    const newMovie = req.body;
    await Movie.create(newMovie);
    res.json(req.body);
});


// Route to get all movies or search by title
router.get("/search", async (req, res) => {
    const { query } = req.query; // The search term sent from the front end

    try {
        // If a search term is provided, filter movies by title
        const movies = query
            ? await Movie.findAll({ where: { title: { [Op.like]: `%${query}%` } } })
            : await Movie.findAll(); // Fetch all movies if no search term

        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch movies." });
    }
});

module.exports = router;
