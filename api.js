var express = require('express');
var app = express();
var router = express.Router();
var db = require("./handlers/dbHandler")

router.post("/addUser", addUser)
router.post("/addChild", addChild)
router.post("/addTask", addTask)
router.post("/addNote", addNote)
router.post("/addActionList", addActionList)
router.post("/updateTaskStatus", updateTaskStatus)
router.post("/deleteChild", deleteChild)
router.post("/deleteTask", deleteTask)


module.exports = router

async function addUser(req, res, next) {
    var reqBody = req["body"]
    let action = await db.addUser(reqBody["name"], reqBody["phone"], reqBody["email"], reqBody["password"])
    res.send(action)
}

async function addChild(req, res, next) {
    var reqBody = req["body"]
    let action = await db.addChild(reqBody["parentPhone"], reqBody["name"], reqBody["phone"])
    res.send(action)

}

function addTask(req, res, next) {
    var reqBody = req["body"]
    console.log(reqBody)
    console.log(reqBody)
    db.addTask(reqBody["phone"], reqBody["name"], reqBody["image"], reqBody["startTime"], reqBody["endTime"], reqBody["list"], reqBody["note"])
        .then(data => {
            res.send(data)
        })
}

async function addNote(req, res, next) {
    var reqBody = req["body"]
    let action = await db.addNote(reqBody["phone"], reqBody["taskId"], reqBody["note"])
    res.send(action)

}

async function addActionList(req, res, next) {
    var reqBody = req["body"]
    let action = await db.addActionList(reqBody["phone"], reqBody["taskId"], reqBody["list"])
    res.send(action)

}

async function updateTaskStatus(req, res, next) {
    var reqBody = req["body"]
    let action = await db.updateTaskStatus(reqBody["phone"], reqBody["taskId"])
    res.send(action)

}

async function deleteChild(req, res, next) {
    var reqBody = req["body"]
    let action = await db.deleteChild(reqBody["phone"])
    res.send(action)

}

async function deleteTask(req, res, next) {
    var reqBody = req["body"]
    let action = await db.deleteChild(reqBody["phone"], reqBody["taskId"])
    res.send(action)

}
