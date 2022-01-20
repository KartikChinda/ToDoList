const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');

var items = [];

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kartik11:1517sec4@cluster0.zkeb3.mongodb.net/toDoListDb", { useNewUrlParser: true });

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var currentDay = today.toLocaleDateString("en-US", options);

    // THis code here is used to serve the items array from the db to the ejs file. 
    Item.find({}, function (err, foundItems) {
        if (!err) {
            res.render("days", { dayName: currentDay, newItems: foundItems });
        }
    })

})



app.post("/", function (req, res) {
    // THis is how you will insert stuff inside the DB. 
    var item = req.body.newWork;
    var newItem = new Item({
        name: item
    });
    newItem.save();
    // redirect so that it shows up and builds the page again. 
    res.redirect("/");
})

// SO here is what we are doing to delete shit. We created a form, on which we made the action as /delete

app.post("/delete", function (req, res) {
    const checkedId = req.body.checkbox;
    Item.findByIdAndRemove(checkedId, function (err) {
        if (err) {
            console.log(err);
        }
    })
    res.redirect("/");
})



app.listen(4000);