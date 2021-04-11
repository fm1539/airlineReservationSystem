const express = require('express')  //import
const bodyParser = require('body-parser')   //import

const app = express()               // creating an instance of express

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

app.use(bodyParser.json())          //allows to send json //allows.json method
app.use(bodyParser.urlencoded({ extended: true }));


var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'bhvnh1znohtkeluykr2r-mysql.services.clever-cloud.com',
  user     : 'ubsbqvfcyngpgwfb',
  password : 'JGwD07olU9zwGKAWnliE',
  database : 'bhvnh1znohtkeluykr2r'
});

connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);  //results is an array of objects
// });

// connection.query('SELECT * FROM Customer', function(error, results, fields) {
//     if (error) throw error;
//     console.log(results);
// })

app.post('/api/customer/register', function(req, res){
    
    var arr = [req.body.email,req.body.name,req.body.password,req.body.building_number,req.body.street,req.body.city,req.body.state,
        req.body.phone_number,req.body.passport_number,req.body.passport_expiration,req.body.passport_country,req.body.date_of_birth]
    let dynamic = ''
    arr.forEach((element, index) => {
        if (index == arr.length-1){
            dynamic +=  "'" + element + "'"
        } else{
            dynamic += "'" + element + "',"
        }
});

    const begin = "INSERT INTO `Customer` (`email`,`name`,`password`,`building_number`,`street`,`city`,`state`,`phone_number`,`passport_number`,`passport_expiration`,`passport_country`,`date_of_birth`)"
    connection.query(begin + " VALUES (" + dynamic + ")", function (err, results, fields){
        if (err) res.json({'status': 'invalid'})
        else res.json({'status': 'registered'})  
    })
})

app.post('/api/customer/login', function(req, res){
    email = req.body.email
    password = req.body.password

    connection.query("SELECT email FROM Customer WHERE email ='" + email + "' and password ='" + password + "'", function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})

        if (results.length){    //if non empty result
            console.log(results[0].email);
            const custObj = {
                'email': results[0].email
            }
            res.json({'status': 'logged', 'custObj': custObj})
        }
        else{       // empty result
            res.json({'status': 'invalidempty'})  
        }
    })
})

app.post('/api/customer/:custEmail/viewFlights', function(req, res){
    const email = req.params.custEmail
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const a = "with futureDates(ticketID, airline_name, flight_number, depart_date, depart_time) as( "
    const b = "SELECT ticketID, airline_name, flight_number, depart_date, depart_time "
    const c = "FROM Agent_Purchases "
    const d = "WHERE " + "'"+email+"'"+ " = customer_email and depart_date >= "+"'"+date+"' "
    const e = "UNION SELECT ticketID, airline_name, flight_number, depart_date, depart_time "
    const f = "WHERE " + "'"+email+"'"+ " = customer_email and depart_date >= "+"'"+date+"' "
    const g = ")Select * from futureDates WHERE  ticketID NOT IN (SELECT ticketID "
    const h = "FROM futureDates"
    const i = "WHERE depart_date = "+"'"+date+"'"+" and depart_time < "+"'"+time+"' ) "
    connection.query(a+b+c+d+e+f+g+h+i, function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        if (results.length){ //non empty result
            const futureFlightObj = {
                email: email,
                test1: date,
                test2: time,
                results
            }
            res.json(futureFlightObj)
        }
        else{       // empty result
            res.json({'status': 'invalidempty'})
        }
    })
})

app.get('/api/:airLineID', function(req, res){      // the colon makes it so its flexible
    console.log(req.params.airLineID)               //this prints the users parameter
    const airLineName = req.params.airLineID
    const obj = { airLineName: database[airLineName] }
    res.json(obj)                  
    //res.send(req.params.airLineID)   //prints the user's parameter to their browser //res is "resposne you want to send back"
})

// app.get('/md', function(request, response){   //goes to route /md 
//     const name = 'John'
//     //response.send('<h1>Hello John</h1>')            //response.send is like the return statement this printed to http://localhost:8000/md
//     response.render('home', {name})              //we are passing name into home.ejs, We are injecting information into the front end
// })

app.listen(8000, function(){            //designate which port you want to run
    console.log("server on 8000");
})