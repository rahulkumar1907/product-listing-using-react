const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const route = require('./Routes/Routes.js');
const { default: mongoose } = require('mongoose');

var app = express();
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://rahulkumar:9996262236@cluster0.jdea1mv.mongodb.net/e-commerce", {
    useNewUrlParser: true,
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 5000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5000))
});
