const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// create default entries
BlogPosts.create("This is my first blog entry!", "And the sun might or might not be shining!", "Nicolas");
BlogPosts.create("This is my second blog entry!", "This is my first blog API!", "John");

// return all existing entries
router.get("/", (req, res, next) => {
    res.send(BlogPosts.get());
});

// return existing specific entry
router.get("/:id", (req, res, next) => {
    res.send(BlogPosts.get(req.params.id));
});

// post new entry
router.post("/", jsonParser, (req, res, next) => {
    if (req.body.title && req.body.content && req.body.author) {
        BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
        console.log(`Entry called "${req.body.title}" created!`);
        res.send(BlogPosts.get());
    } else {
        console.log("A parameter is missing and I'm too lazy to tell you which one. Cannot CREATE.");
        next();
    }
});

// delete entry
router.delete("/:id", (req, res, next) => {
    BlogPosts.delete(req.params.id);
    console.log(`Entry with ID "${req.params.id}" deleted!`);
    res.send(BlogPosts.get());
});

// edit entry
router.put("/:id", jsonParser, (req, res, next) => {
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
        console.log(`Entry with ID "${req.params.id}" updated!`);
        res.send(BlogPosts.get(req.params.id));
    } else {
        console.log("A parameter is missing and I'm too lazy to tell you which one. Cannot EDIT.");
        next();   
    }
});

module.exports = router;