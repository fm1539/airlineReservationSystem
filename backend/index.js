const express = require('express')  //import
const bodyParser = require('body-parser')   //import
require('dotenv').config()

const stripeSecretKey = process.env.SECRETKEY 
const stripePublicKey = process.env.PUBLISHABLEKEY
const stripe = require ('stripe')(stripeSecretKey)

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

app.get('/api/customer/:custEmail/viewFlights', function(req, res){
    const email = req.params.custEmail
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    connection.query(`
    with allPurchases(ticketID, airline_name, flight_number, depart_date, depart_time) as 
    ( 
    SELECT ticketID, airline_name, flight_number, depart_date, depart_time 
    FROM Agent_Purchases WHERE ? = customer_email 
    UNION SELECT ticketID, airline_name, flight_number, depart_date, depart_time 
    FROM Customer_Purchases WHERE ? = customer_email 
    ) 
    SELECT * from allPurchases natural join Flight
    `, [email,email] ,function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        if (results.length){ //non empty result
            const futureFlightObj = {
                email: email,
                results
            }
            res.json({
                'status': 'success',
                'futureFlightObj': futureFlightObj
            })
        }
        else{       // empty result
            res.json({'status': 'invalidempty'})
        }
    })
})

app.get('/api/customer/getAllAirports', function (req, res){
    connection.query(`SELECT name FROM Airport`,
    function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        if (results.length){
            let arr = []
            results.forEach(element => {
                arr.push(element.name)
            });
            res.json({
                'status': 'success',
                'results': arr
            })
        }
        else{
            res.json({'status': 'no_airports'})
        }
    })
})

app.get('/api/customer/getAllCities', function (req, res){
    connection.query(`SELECT city FROM Airport`,
    function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        if (results.length){
            console.log(results);
            let arr = []
            results.forEach(element => {
                arr.push(element.city)
            });
            res.json({
                'status': 'success',
                'results': arr
            })
        }
        else{
            res.json({'status': 'no_airports'})
        }
    })
})

app.get('/api/customer/searchForFlights', function(req, res){
    const obj ={
        "sourceCity": req.query.sourceCity,
        "sourceAirport": req.query.sourceAirport,
        "destinationCity": req.query.destinationCity,
        "destinationAirport": req.query.destinationAirport,
        "departureDate": req.query.departureDate,
        "returnDate": req.query.returnDate
    }

    for (var key in obj){
        if (obj[key] === undefined){
            obj[key] = '%'
        }
    }

    console.log(obj);

    // console.log(obj.sourceAirport)    
    // console.log(obj.destinationAirport)   
    // console.log(obj.departureDate)   
    // console.log(obj.returnDate)   
    connection.query(`
    with allPurchases(airline_name, flight_number, depart_date, depart_time, arrive_date, arrive_time, arrive_airport_name, depart_airport_name, base_price, status, depart_city) 
as
(
SELECT airline_name, flight_number, depart_date, depart_time, arrive_date, arrive_time, arrive_airport_name, depart_airport_name, base_price, status, city
from Flight NATURAL join Airport
WHERE depart_airport_name = Airport.name
) 
SELECT airline_name, flight_number, depart_date, depart_time, arrive_date, arrive_time, arrive_airport_name, depart_airport_name, base_price, status,depart_city, city as arrive_city
FROM allPurchases NATURAL join Airport 
where arrive_airport_name = Airport.name
and depart_airport_name LIKE ? 
and arrive_airport_name LIKE ? 
and depart_date LIKE ?
and arrive_date LIKE  ?
and depart_city LIKE ?
and city LIKE ?
    `, [obj["sourceAirport"],obj["destinationAirport"],obj["departureDate"],obj["returnDate"],obj["sourceCity"],obj["destinationCity"]] ,function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        if (results.length){ //non empty result
            res.json({
                'status': 'success',
                'flightsArr': results
            })
        }
        else{       // empty result
            res.json({'status': 'invalidempty'})
        }
    })
})

app.post('/api/customer/purchaseTickets', function(req, res){
    email = req.body.email
    airline_name = req.body.airline_name
    flight_number = req.body.flight_number
    depart_date = req.body.depart_date
    depart_time = req.body.depart_time
    let ticketID = 0
    connection.query("Select * from `Ticket` Where 1", function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        else{
            let ticketID = results.length+1
        }
    })
    connection.query(`INSERT INTO 'Ticket' ('ticketID', 'airline_name', 'flight_number', 'depart_date', 'depart_time') 
    VALUES (?, ?, ?, ?, ?)
    `, [ticketID,airline_name,flight_number,depart_date,depart_time], function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        else res.json({'status': 'insert1successful'}) 
    })
    connection.query(`INSERT INTO 'Customer_Purchases' ('ticketID', 'airline_name', 'flight_number', 'depart_date', 'depart_time','customer_email') 
    VALUES (?, ?, ?, ?, ?, ?)
    `, [ticketID,airline_name,flight_number,depart_date,depart_time,email], function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        else res.json({'status': 'insert2successful'}) 
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