const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// Function to fetch a list of movies
async function list(is_showing) {
    return db("movies")
        .select("movies.*")
        .modify((queryBuilder) => {
            if (is_showing) {
                queryBuilder
                    .join(
                        "movies_theaters",
                        "movies.movie_id",
                        "movies_theaters.movie_id"
                    )
                    .where({ "movies_theaters.is_showing": true })
                    .groupBy("movies.movie_id");
            }
        });
}

// Function to fetch a specific movie by ID
async function read(movie_id) {
    return db("movies").select("*").where({ movie_id }).first();
}

// Function to fetch theaters where a specific movie is playing
async function listTheatersByMovie(movie_id) {
    return db("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .select("t.*", "mt.is_showing", "mt.movie_id")
        .where({ "mt.movie_id": movie_id });
}

// Function to fetch reviews for a specific movie, including critic details
const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

async function listReviewsByMovie(movie_id) {
    return db("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ movie_id })
        .then((reviews) => reviews.map(addCritic));
}

module.exports = {
    list,
    read,
    listTheatersByMovie,
    listReviewsByMovie,
};
