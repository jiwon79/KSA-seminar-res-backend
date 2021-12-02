const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const app = express()
const cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const utils = require('./utils');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.KSA_SEMINAR_KIOSK_DB);
var db = mongoose.connection;
db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('Connected!');
});

const userLogSchema = new Schema({
  option: String,
  user: {
    name: String,
    number: String,
    tel: String
  },
  reserve: {
    room: String,
    time: String
  },
  time: String
});

const reserveLogSchema = new Schema({
  date: String,
  number: {
    a: [String],
    b: [String],
    c: [String],
    d: [String],
    e: [String]
  },
  name: {
    a: [String],
    b: [String],
    c: [String],
    d: [String],
    e: [String]
  }
});

app.get('/', (req, res) => {
  res.send({api: 'ksa-seminar-reservation-kisok-api'});
})

app.get('/log/seminar', async (req, res) => {
  const now = new Date();
  const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const date = new Date(utcNow + koreaTimeDiff);
  
  var todayDate = date.format('yyyy-MM-dd(ES)')
  console.log('get log/seminar');

  var reserveLog = mongoose.model('reserve_logs', reserveLogSchema);
  try {
    let count = await reserveLog.count({ date: todayDate });
    if (count == 0) {
      let data_name = Array(15).fill('-');
      let data_number = Array(15).fill('00-000');

      var reserveLog = mongoose.model('reserve_logs', reserveLogSchema);
      var reserveLogData = new reserveLog({
        date: todayDate,
        name: {
          a: data_name,
          b: data_name,
          c: data_name,
          d: data_name,
          e: data_name
        },
        number: {
          a: data_number,
          b: data_number,
          c: data_number,
          d: data_number,
          e: data_number,
        }
      });
      reserveLogData.save();
      res.send({ result: 'SUCCESS', data: reserveLogData });
    } else {
      var todayReserveData = await reserveLog.findOne({ date: todayDate });
      res.send({ result: 'SUCCESS', data: todayReserveData });
    }
  } catch(e) {
    console.log(e);
    res.send({result: 'FAIL'});
  }
})

app.put('/log/seminar', async (req, res) => {
  console.log('put log/seminar');
  reserve_name = JSON.parse(req.body.name);
  reserve_number = JSON.parse(req.body.number);
  
  const now = new Date();
  const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const date = new Date(utcNow + koreaTimeDiff);
  var todayDate = date.format('yyyy-MM-dd(ES)');

  var reserveLog = mongoose.model('reserve_logs', reserveLogSchema);
  var reserveLogData = new reserveLog({
    date: todayDate, 
    name: reserve_name, 
    number: reserve_number
  });

  try {
    var count = await reserveLog.count({ 'date': todayDate });

    if (count == 0) {
      await reserveLogData.save();
    } else {
      const filter = { date: todayDate };
      const update = { number: reserve_number, name: reserve_name };
      reserveLog.findOneAndUpdate(filter, update).exec();
    }
    res.send({'result': 'SUCCESS'});
  } catch(e) {
    console.log(e);
    res.send({'result': 'FAIL'});
  }
})

app.post('/log/user', async (req, res) => {
  console.log('/log/user');
  
  const now = new Date();
  const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const date = new Date(utcNow + koreaTimeDiff);

  var userLog = mongoose.model('user_logs', userLogSchema);
  var userLogData = new userLog({
    option: req.body.option,
    user: {
      name: req.body.name,
      number: req.body.number,
      tel: req.body.tel
    },
    reserve: {
      room: req.body.room,
      time: req.body.time
    },
    time: date.format('yyyy-MM-dd HH-mm-ss')
  })
  try {
    await userLogData.save();
    res.send({ result: 'SUCCESS' });
  } catch(e) {
    res.send({ result: 'FAIL' });
  }
})


app.get('/userLog', (req, res) => {
  var datas = mongoose.model('userLog', userLogSchema, 'user_logs');
  var rowData = [];
  datas.find(function(error, userLog) {
    if(error) {
      console.log("error : ", error)
    } else {
      userLog.forEach(function(row) {
        rowData.push(row);
        console.log("data : ", row)
      })
    }
    res.json(rowData);
  })
  // res.json({name: 'naemanaem'});
})

app.post('/log/userLog', (req, res) => {
  var datas = mongoose.model('userLog', userLogSchema, 'user_logs');
  console.log(req.body.logDate)
  var logDate = new Date(req.body.logDate).format('yyyy-MM-dd');
  console.log(logDate);
  console.log(typeof(logDate));

  var rowData = [];
  datas.find(function(error, userLog) {
    if(error) {
      console.log("error : ", error)
    } else {
      userLog.forEach(function(row) {
        console.log(row.time);
        if (row.time.includes(logDate)) {
          rowData.push(row);
        }
      })
    }
    res.json(rowData);
  })
})


app.get('/auth', (req, res) => {
  res.send(req.query.id+','+req.query.pw)
})

app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});