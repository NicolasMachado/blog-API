const express = require('express');
const morgan = require('morgan');

const app = express();

const postsRouter = require('./postsRouter');

// log the http layer
app.use(morgan('common'));

app.use('/posts', postsRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something went wrong').end();
}); 

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
