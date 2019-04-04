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

function addUser(req, res, next) {
    var reqBody = req["body"]
    db.addUser(reqBody["name"], reqBody["phone"], reqBody["email"], reqBody["password"])
}

function addChild(req, res, next) {
    var reqBody = req["body"]
    db.addChild(reqBody["parentPhone"], reqBody["name"], reqBody["phone"])
}

function addTask(req, res, next) {
    var reqBody = req["body"]
    db.addTask(reqBody["phone"], reqBody["name"], reqBody["image"], reqBody["time"], reqBody["list"], reqBody["note"])
}

function addNote(req, res, next) {
    var reqBody = req["body"]
    db.addNote(reqBody["phone"], reqBody["taskId"], reqBody["note"])
}

function addActionList(req, res, next) {
    var reqBody = req["body"]
    db.addActionList(reqBody["phone"], reqBody["taskId"], reqBody["list"])
}

function updateTaskStatus(req, res, next) {
    var reqBody = req["body"]
    db.updateTaskStatus(reqBody["phone"], reqBody["taskId"])
}

function deleteChild(req, res, next) {
    var reqBody = req["body"]
    db.deleteChild(reqBody["phone"])
}

function deleteTask(req, res, next) {
    var reqBody = req["body"]
    db.deleteChild(reqBody["phone"], reqBody["taskId"])
}
