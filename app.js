const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();
 
// log the http layer
app.use(morgan('common'));

// create default entries
BlogPosts.create("This is my first blog entry!", "What an exciting time to be alive!", "Nicolas");
BlogPosts.create("This is my second blog entry!", "This is my second blog API! Jk it's my first.", "John");

// return all existing entries
app.get("/posts/", (req, res, next) => {
	res.send(BlogPosts.get());
});

// return existing specific entry
app.get("/posts/:id", (req, res, next) => {
	res.send(BlogPosts.get(req.params.id));	
});

// post new entry
app.post("/posts", jsonParser, (req, res, next) => {
	if (req.body.title && req.body.content && req.body.author) {
		BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
		res.send(`Entry called "${req.body.title}" created!`);
	} else {
		console.log("A parameter is missing. Cannot CREATE.");
		next();
	}
});

// edit entry
app.put("/posts/:id", jsonParser, (req, res, next) => {
	if (req.params.id && req.body.title && req.body.content && req.body.author) {
		const updatedEntry = {
			id: req.params.id, 
			title: req.body.title, 
			content: req.body.content, 
			author: req.body.author
		};
		if (req.body.publishDate) {
			updatedEntry.publishDate = req.body.publishDate;
		}
		BlogPosts.update(updatedEntry);
		res.send(`Entry ${req.params.id} updated!`);
	} else {
		console.log("A parameter is missing. Cannot EDIT.");
		next();		
	}
});

// delete entry
app.delete("/posts/:id", (req, res, next) => {
	BlogPosts.delete(req.params.id);
	res.send("Entry deleted!");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Something went wrong').end();
}); 

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});