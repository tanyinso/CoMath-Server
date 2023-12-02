const express = require('express'),
     cors = require('cors'),
     bodyParser = require('body-parser')
const db=require('./config/dbase')
require('dotenv').config()


const {errorHandler} = require('./middleware/errorMiddleware')
const app = express();
// MongoDB Configuration
const port =  6666;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const whiteList = ['https://main.d38udkoztmqkwd.amplifyapp.com', 'http://localhost:3000','http://localhost:8888']
app.use(cors(
{
origin:whiteList,
optionsSuccessStatus:200,
credentials:true,
}
))


app.use('/public', express.static('public'));
app.use(errorHandler);
app.use('/user', require('./routes/user.routes') )
app.use('/teacher', require('./routes/teachers.routes'))
app.use('/content', require('./routes/content.routes'))




app.listen(port, () => {
     console.log('Connected to port ' + port)
 })


 