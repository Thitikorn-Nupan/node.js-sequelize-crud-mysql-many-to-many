import Logging from "./log/logging.js";
import actorRouter from "./routers/actor.router.js";
import movieRouter from "./routers/movie.router.js";
import express from "express";

const application = express()
application.use('/api/actor',actorRouter)
application.use('/api/movie',movieRouter)
application.listen(3000,(error) => {
    if (error) throw error
    else Logging.winston.info('you are on port 3000')
})