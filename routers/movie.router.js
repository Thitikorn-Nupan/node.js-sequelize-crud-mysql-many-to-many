import Logging from "../log/logging.js";
import MovieServiceCrud from "../crud/movie.service.crud.js";
import express from "express"
import bodyParser from "body-parser";

const serviceCrud = new MovieServiceCrud()
const movieRouter = express.Router()

// setting middle ware
movieRouter.use(bodyParser.json())
movieRouter.use(bodyParser.urlencoded({extended: true}))

movieRouter.get('/reads', async (req, res) => {
    await serviceCrud.retrieveAllMovies().then((response) => {
        return res
            .status(202)
            .json({
                status: "accepted",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

movieRouter.get('/read', async (req, res) => {
    const mid = req.query.mid
    await serviceCrud.retrieveMovie(mid).then((response) => {
        return res
            .status(202)
            .json({
                status: "accepted",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

export default movieRouter