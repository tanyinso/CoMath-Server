const express = require('express'),
     cors = require('cors'),
     bodyParser = require('body-parser')
const db=require('./config/dbase')
require('dotenv').config()


const {errorHandler} = require('./middleware/errorMiddleware')
const app = express();
// MongoDB Configuration
const port = process.env.PORT || 6666;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use('/public', express.static('public'));
app.use(errorHandler);
app.use('/user', require('./routes/user.routes') )
app.use('/teacher', require('./routes/teachers.routes'))
app.use('/content', require('./routes/content.routes'))




app.listen(port, () => {
     console.log('Connected to port ' + port)
 })


 