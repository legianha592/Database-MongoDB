const express = require("express")
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient
const app = express()

app.use(express.static(__dirname + '/public'));

let db

MongoClient.connect("mongodb://localhost/27017", (err, client) => {
    if (err){
        return console.log(err)
    }
    db = client.db("animals")
    console.log("Đã kết nối với database", __dirname)

})


app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

// app.get("/", function(req, res){
//     res.send("<h1>Hello from server</h1>")
// })

app.get("/", function(req, res){
    // console.log("dirname = ", __dirname)
    // res.sendFile(__dirname + "/index.html")
    let animals = db.collection("newanimals").find().toArray().then(results => {
        res.render("index.ejs", { results })
    }).catch(error => {
        console.log(error)
    })
    // console.log("animals", animals)
})

app.get("/todo/:id", function(req, res) {
    let id = req.params['id']
    let objectId = require("mongodb").ObjectID
    let animals = db.collection("newanimals").findOne({_id: new objectId(id)}).then(results => {
        console.log("result = ", results)
        res.render("todo.ejs", { todo: results })
    }).catch(error => {
        console.log(error)
    })
    // res.send("Name is " + id)
})

app.post("/new-todo", function(req, res){
    console.log("Nhận request", req.body)
    db.collection("newanimals").insertOne(req.body).then(results => {
        res.render("index.ejs", { results })
    }).catch(error => {
        console.log(error)
    })
})

app.post("/update-todo", function(req, res){
    console.log("Nhận request", req.body)
    let objectId = require("mongodb").ObjectID
    db.collection("newanimals").findOneAndUpdate(
        { _id: new objectId(req.body.id) },
        { $set: {name: req.body.name, link: req.body.link} }
    ).then(results => {
        console.log("result = ", results)
    }).catch(error => {
        console.log(error)
    })
})

app.post("/delete-todo", function(req, res){
    console.log("Nhận request", req.body)
    let objectId = require("mongodb").ObjectID
    db.collection("newanimals").deleteOne(
        { _id: new objectId(req.body.id) }
    ).then(results => {
        console.log("result = ", results)
    }).catch(error => {
        console.log(error)
    })
})

app.listen(3000, function(){
    console.log("hello world on 3000")
})
