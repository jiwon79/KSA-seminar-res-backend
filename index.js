const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const app = express()
const cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
  name: String,
  time: String,
  number: String
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
  var date = new Date();
  var todayDate = date.toLocaleDateString();
  console.log(todayDate);
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
  var date = new Date();
  var todayDate = date.toLocaleDateString();
  console.log(todayDate);

  var reserveLog = mongoose.model('reserve_logs', reserveLogSchema);
  var reserveLogData = new reserveLog({
    date: todayDate,
    name: {
      a: reserve_name.a,
      b: reserve_name.b,
      c: reserve_name.c,
      d: reserve_name.d,
      e: reserve_name.e
    },
    number: {
      a: reserve_number.a,
      b: reserve_number.b,
      c: reserve_number.c,
      d: reserve_number.d,
      e: reserve_number.e
    }
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

app.get('/userLog', (req, res) => {
  var datas = mongoose.model('userLog', userLogSchema, 'user_log');
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

app.get('/auth', (req, res) => {
  res.send(req.query.id+','+req.query.pw)
})

app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});