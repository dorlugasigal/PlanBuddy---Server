var MongoClient = require('mongodb').MongoClient;
const dbname = "planBuddy";
const url = "mongodb://localhost:27017";

// Connect to the db
const connection = () => new Promise((resolve, reject) => {
    let client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, db) => {
        if (err) reject(err)
        else {
            console.log("connected to DB")
            resolve(client.db(dbname))
        }
    })
})

exports.addUser = (name, phone, email, password) => new Promise(resolve => {
    connection().then(db => {
        let data = { "full name": name, "phone": phone, "email": email, "password": password, "children": [] }
        db.collection("parents").insertOne(data).then(response => {
            resolve(response.ops[0])
        })
    })
});

exports.addChild = (parentPhone, name, phone) => new Promise(resolve => {
    connection().then(db => {
        let data = { "parent_phone": parentPhone, "full_name": name, "phone": phone, "schedule": [] }
        db.collection("parents").findOneAndUpdate(
            { "phone": parentPhone },
            { $push: { "children": { "full name": name, "phone": phone } } },
            { upsert: true }
        )
        db.collection("children").insertOne(data).then(response => {
            resolve(response.ops[0])
        })
    })
});


exports.addTask = (phone, name, image, startTime, endTime, list, note) => new Promise(resolve => {
    connection().then(db => {
        db.collection("children").findOneAndUpdate({ "phone": phone },
            { $push: { "schedule": { "name": name, "image": image, "startTime": startTime, "endTime": endTime, "actionList": list, "note": note, "state": false } } },
        ).then(data => {
            resolve(data)
        })
    })
});

exports.addNote = (phone, taskId, note) => new Promise(resolve => {
    connection().then(db => {
        db.collection("children").findOneAndUpdate({ $and: [{ "phone": phone }, { "schedule": { $elemMatch: { "_id": taskId } } }] },
            { $set: { "schedule": { "note": note } } }).then(data => {
                resolve(data)
            })
    })
});

exports.addActionList = (phone, taskId, list) => new Promise(resolve => {
    connection().then(db => {
        db.collection('children').findOneAndUpdate(
            { "phone": phone },
            { $push: { "schedule": { "list": list } } }
        ).then(result => {
            resolve(result)
        })
    })
});

exports.updateTaskStatus = (phone, taskId) => new Promise(resolve => {
    connection().then(db => {
        db.collection("children").findOneAndUpdate({ $and: [{ "phone": phone }, { "schedule": { $elemMatch: { "_id": taskId } } }] },
            { $set: { "status": true } }).then(data => {
                resolve(data)
            })
    })
});


exports.deleteChild = (phone) => new Promise(resolve => {
    connection().then(db => {
        let parentPhone = db.collection("children").find({ "phone": phone })["parent_phone"];
        db.collection("parents").update({ "phone": parentPhone }, { $pull: { "children": { $elemMatch: { "phone": phone } } } })
        db.collection("children").findAndModify({
            query: { "phone": phone },
            remove: true
        }).then(data => {
            resolve(data)
        })
    })
});

exports.updateTaskStatus = (phone, taskId) => new Promise(resolve => {
    connection().then(db => {
        db.collection("children").update({ "phone": phone }, { $pull: { "schedule": { $elemMatch: { "taskId": taskId } } } }).then(data => {
            resolve(data)
        })
    })
});
