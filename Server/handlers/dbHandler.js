var MongoClient = require('mongodb').MongoClient;
const dbname = "planBuddy";
const url = "mongodb+srv://administrator:administrator@cluster0-rzb23.mongodb.net/test?retryWrites=true";

// Connect to the db
const connection = () => new Promise((resolve, reject) => {
    let client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, db) => {
        if (err) reject(err);
        resolve(client.db(dbname))
    })
})


exports.addUser = async (name, phone, email, password) => {
    let db = await connection();
    let data = { "full name": name, "phone": phone, "email": email, "password": password, "children": [] }
    let inserted = await db.collection("parents").insertOne(data);
    return inserted;
}

exports.addChild = async (parentPhone, name, phone) => {
    let db = await connection();
    let data = { "parent_phone": parentPhone, "full_name": name, "phone": phone, "schedule": [] }
    let inserted = await db.collection("children").insertOne(data);
    let parent_update = await db.collection("parents").update(
        { "phone": parentPhone },
        { $push: { "children": { "full name": name, "phone": phone } } }
    )
    return inserted;
}

exports.addTask = async (phone, name, image, time, list, note) => {
    let db = await connection();
    let updated = db.collection('children').update(
        { "phone": phone },
        { $push: { "schedule": { "name": name, "image": image, "time": time, "actionList": list, "note": note, "state": false } } }
    )
    return updated;
}

exports.addNote = async (phone, taskId, note) => {
    let db = await connection();
    let data = { "parent_phone": parentPhone, "full_name": name, "phone": phone }
    let updated = db.collection('children').findAndModify({
        query: { "phone": phone },
        update: { $set: { "schedule": { "note": note } } }
    })
    return updated;
}

exports.addActionList = async (phone, taskId, list) => {
    let db = await connection();
    let data = { "phone": phone, "taskId": taskId, "list": list }
    let updated = db.collection('children').update(
        { "phone": phone },
        { $push: { "schedule": { "list": list } } }
    )
    return updated;
}

exports.updateTaskStatus = async (phone, taskId) => {
    let db = await connection();
    let updated = db.collection('children').update(
        { "taskId": taskId },
        { $set: { "schedule": { "children.taskId.content": true } } }
    )
    let taskArray = db.collection('children').find({ "phone": phone })["schedule"]
}

exports.deleteChild = async (phone) => {
    let db = await connection();
    let parentPhone = db.collection("children").find({ "phone": phone })["parent_phone"];
    db.collection("parents").update({ "phone": parentPhone }, { $pull: { "children": { $elemMatch: { "phone": phone } } } })
    db.collection("children").findAndModify({
        query: { "phone": phone },
        remove: true
    })
}

exports.deleteTask = async (phone, taskId) => {
    let db = await connection();
    db.collection("children").update({ "phone": phone }, { $pull: { "schedule": { $elemMatch: { "taskId": taskId } } } })
}