import Actor from "../entities/actor.js";
import Movie from "../entities/movie.js";
import Logging from "../log/logging.js";

/*
    You have to know
    You set up at all about sequelize in the part of entities As, Actor.belongsToMany({}) , Movie.belongsToMany({})
    it's done on that file actor.service.crud.js
    So you don't set it again
*/

class MovieServiceCrud {
    retrieveAllMovies = async () => { /* reads direct left join */
        return await Movie.findAll({
            include: [
                {
                    model: Actor,
                    as: "actors",
                    attributes : { exclude:['aid'] },
                    // not clear but it works for removing association table (actors_movies)
                    through: {
                        attributes: [],
                    }
                },
            ]
        })
    }
    /*
    "mid": "M001",
            "title": "Fallout",
            "categories": "Action,Adventure,Drama",
            "rate": "8.7",
            "year": "2024-04-11",
            "actors": [
                {
                    "fullname": "Ella Purnell",
                    "born": "1996-09-17",
                    "contact": "0663232321"
                },
                {
                    "fullname": "Aaron Moten",
                    "born": "1989-02-28",
                    "contact": "0163235329"
                },
                {
                    "fullname": "Walton Goggins",
                    "born": "1971-09-10",
                    "contact": "0743232325"
                }
            ]
        },
        ..
        .
        .
    */

    retrieveMovie = async (mid) => { /* reads direct left join */
        return await Movie.findByPk(mid,{
            include: [
                {
                    model: Actor,
                    as: "actors",
                    attributes : { exclude:['aid'] },
                    through: {
                        attributes: [],
                    }
                },
            ]
        })
    }
}

export default MovieServiceCrud