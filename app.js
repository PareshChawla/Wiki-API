const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});
//creating new schema for the data in mongodb
const articleSchema = {
  title: String,
  content: String
};
//creates new model which mongo takes as singular(Article) and returns in lowercase plural form(articles)
const Article = mongoose.model("Article", articleSchema);

////////////////////////////Requests targetting all articles//////////////////////////////////

app.route("/articles")

//handles get request and find the data from the database(foundArticles) and
//shows client the requested articles on browser
.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if(!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }

  });
})
//handles post request //To create data in database, use new keyword
//and store in title and content
//Saves the newArticle created in mongoose of mongodb and returns message.
.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })
  newArticle.save(function(err){
    if(!err) {
      console.log("Successfully added a new article.");
    } else {
      console.log(err);
    }
  })
})

//handles delete request and deletes all the articles(deleteMany)
.delete(function(req, res) {
  Article.deleteMany(function(err){
    if(!err) {
      res.send("Successfully deleted all articles.")
    } else {
      res.send(err);
    }
  });
});

////////////////////////////Requests targetting a specific article//////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
    if(foundArticle) {
      res.send(foundArticle);
    } else {
      console.log("No Article matching that title was found.");
    }
  })
})

.put(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwritten: true},
    function(err) {
      if(!err) {
        res.send("Successfully updated the article.");
      }
    }
  );
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if(!err) {
        res.send("Successfully updated the article.")
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if(!err) {
        res.send("Successfully deleted the specific article.")
      } else {
        res.send(err);
      }
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
