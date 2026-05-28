import Logging from "../log/logging.js";
import ActorCrud from "../crud/actor.crud.js";
import express from "express"
import bodyParser from "body-parser";

const actorCrudObj = new ActorCrud()
const actorRouter = express.Router()

// setting middle ware
actorRouter.use(bodyParser.json())
actorRouter.use(bodyParser.urlencoded({extended: true}))

// Anything wrong on response i set up to throw error
actorRouter.get('/reads', async (req, res) => {
    await actorCrudObj.retrieveAllActors().then((response) => {
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

actorRouter.get('/read', async (req, res) => {
    const aid = req.query.aid // ?aid=A003
    await actorCrudObj.retrieveActor(aid).then((response) => {
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

actorRouter.post('/create', async (req, res) => {
    const {aid, fullname, born, contact} = req.body
    const actor = {
        aid: aid,
        fullname: fullname,
        born: born,
        contact: contact
    }
    await actorCrudObj.addActor(actor).then((response) => {
        return res
            .status(201)
            .json({
                status: "create",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

actorRouter.post('/create/relation', async (req, res) => {
    const {aid, mid} = req.body
    await actorCrudObj.addRelation(aid, mid).then((response) => {
        return res
            .status(201)
            .json({
                status: "create",
                data: response
            })
    }).catch((error) => {
        Logging.winston.error(error.message)
        throw error
    })
})

actorRouter.delete('/delete', async (req, res) => {
    const aid = req.query.aid
    await actorCrudObj.removeActor(aid).then((response) => {
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

actorRouter.put('/update', async (req, res) => {
    const aid = req.query.aid
    const {fullname, born, contact} = req.body
    const actor = {
        fullname: fullname,
        born: born,
        contact: contact
    }
    await actorCrudObj.editActor(aid, actor).then((response) => {
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

export default actorRouter