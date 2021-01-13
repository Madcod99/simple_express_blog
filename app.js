const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const mongoose = require('mongoose');
//connection to database
mongoose.connect('mongodb+srv://admin:1234@cluster0.ojqgc.mongodb.net/blogdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

//definition of my schema 
var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now },
});

// schema for the pages content
var pagesContentSchema = new mongoose.Schema({
    about: String,
    coding: String,
    contact: String,
});

//definition of the object
const Article = mongoose.model('Article', articleSchema);


app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


var aboutText = "Nulla quis lorem ut libero malesuada feugiat. Donec rutrum congue leo eget malesuada. Curabitur aliquet quam id dui posuere blandit. Nulla porttitor accumsan tincidunt. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Sed porttitor lectus nibh. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Curabitur aliquet quam id dui posuere blandit.";
var codingText = 'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Nulla porttitor accumsan tincidunt. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Vivamus suscipit tortor eget felis porttitor volutpat. Sed porttitor lectus nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.';


// root page
app.get("/", function (req, res) {
    //get the values from the database and put it into the list
    Article.find(function (err, articles) {
        if (err) {
            console.log(err);
        }
        else {
            let contenu = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, molestias voluptate cumque,sint quod voluptatum explicabo harum laudantium hic facilis aliquid!    Laudantium facilis, assumenda quas animi blanditiis ipsa earum rem.';
            res.render('home', { articles: articles });
        }
    });
});


// about page
app.get("/about", function (req, res) {
    res.render('about', { content: aboutText });
});


// programmation page
app.get("/coding", function (req, res) {
    res.render('coding', { content: codingText });
});


// contact page
app.get("/contact", function (req, res) {
    res.render('contact');
});


app.post("/contact", function (req, res) {
    console.log(req.body);
})


// compose page create article
app.get("/compose", function (req, res) {
    res.render('compose');
});

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

app.post("/compose", function (req, res) {

    // save to database
    let newArticle = new Article({
        title: req.body.titre,
        content: req.body.content,
        author: req.body.auteur,
        date: new Date(req.body.date),
    });
    newArticle.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/compose');
            console.log("Enregistrer avec succès !");
        }
    });
});

// posts article
app.get("/posts/:postname", function (req, res) {
    const postnamerequest = _.lowerCase(req.params.postname);
    let elementLowerCase = "";
    Article.find(function (err, articles) {
        if (err) handleError(err);
        else {
            articles.forEach(function (element) {
                elementLowerCase = _.lowerCase(element._id);
                if (elementLowerCase === postnamerequest) {
                    res.render("posts.ejs", { article: element });
                }
            });
        }
    });
});


app.listen(3000, function () {
    console.log("server started on port 3000");
});