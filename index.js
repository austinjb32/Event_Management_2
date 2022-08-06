const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
var useragent = require('express-useragent');
var nodemailer = require('nodemailer');
require('dotenv').config()


let app = express();

///////route file declaration//////////

const event=require('./Routes/event')




app.use(bodyParser.urlencoded({
    extended: true, limit: '150mb'
}));
app.use(bodyParser.json({ limit: '150mb' }));


const url="mongodb+srv://austinjb32:"+process.env.MONGO_PASSWORD+"@cluster0.qw08n.mongodb.net/eventManagement?retryWrites=true&w=majority"

mongoose.connect(process.env.MONGOURL || url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    // if(data)
    //     console.log("db success", data)
    // if(error)
    //     console.log("db error", error)
    console.log("Db connected")
}).catch((ex) => {
    console.log("Db connection error")
    console.log(ex)
});



var db = mongoose.connection;

var port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet({crossOriginResourcePolicy : false}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(useragent.express());
app.use((req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)
    next();
})




app.use(event);





const server = app.listen(port, function () {
    console.log("Running Server on port " + port);
});