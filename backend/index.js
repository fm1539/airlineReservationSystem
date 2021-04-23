const express = require('express')  //import
const bodyParser = require('body-parser')   //import
require('dotenv').config()
const stripeSecretKey = process.env.SECRETKEY 
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
    connection.query(`
    SELECT * from allPurchases natural join Flight where customer_email  = ?
    `, [email] ,function (err, results, fields){
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
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const yestDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-1);
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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


    // console.log(obj.sourceAirport)    
    // console.log(obj.destinationAirport)   
    // console.log(obj.departureDate)   
    // console.log(obj.returnDate)   
    connection.query(`
    SELECT *
    FROM (allFlights NATURAL JOIN Uses NATURAL join Airplane)
    WHERE seats > (select count(*) from Ticket where airline_name = Ticket.airline_name and flight_number = Ticket.flight_number and depart_date = Ticket.depart_date and depart_time = Ticket.depart_time) 
    and depart_date > ?
    and (flight_number,airline_name,depart_date,depart_time) 
    not in (SELECT flight_number,airline_name,depart_date,depart_time from allFlights where depart_date = ? and depart_time< ? ) 
    and depart_airport_name LIKE ? 
    and arrive_airport_name LIKE ? 
    and depart_date LIKE ?
    and arrive_date LIKE  ?
    and depart_city LIKE ?
    and arrive_city LIKE ?
    `,[yestDate, date, time, obj["sourceAirport"],obj["destinationAirport"],obj["departureDate"],obj["returnDate"],obj["sourceCity"],obj["destinationCity"]] ,function (err, results, fields){
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
app.post('/api/customer/purchaseTickets', async (req, res) => {
    const email = req.body.obj.email
    const airline_name = req.body.obj.airline_name
    const flight_number = req.body.obj.flight_number
    var depart_date = req.body.obj.depart_date
    depart_date = depart_date.slice(0,depart_date.indexOf('T'))
    const depart_time = req.body.obj.depart_time
    const base_price = req.body.obj.base_price

    try {
        const customer = await stripe.customers.create ({
            email: req.body.token.email,
            source: req.body.token.id
        })
        //const idempotency_key = uuid()
        //console.log("HERE 223");
        //console.log("KEY:", idempotency_key);
        const charge = await stripe.charges.create({
                amount: base_price * 100,
                currency: "usd",
                customer: customer.id,
                receipt_email: req.body.token.email,
                description: "Purchased ticket for flight# " + flight_number + " on " + airline_name,
                shipping: {
                    name: req.body.token.card.name,
                    address: {
                        line1: req.body.token.card.address_line1,
                        line2: req.body.token.card.address_line2,
                        city: req.body.token.card.address_city,
                        country: req.body.token.card.address_country,
                        postal_code: req.body.token.card.address_zip
                    }
                }
            }, function (err, success) {
                if (err) console.log(err);
                else {
                    console.log(charge);
                    let ticketID = 0
                    connection.query("Select * from `Ticket` Where 1", function (err, results, fields){
                        if (err) throw err
                        else{
                            ticketID = results.length+1
                            connection.query("INSERT INTO `Ticket` (`ticketID`, `airline_name`, `flight_number`, `depart_date`, `depart_time`) VALUES"+ `(?, ?, ?, ?, ?)`
                            , [ticketID,airline_name,flight_number,depart_date,depart_time], function (err, results, fields){
                                if (err) throw err
                            })
                            
                            connection.query("INSERT INTO `Customer_Purchases` (`ticketID`, `airline_name`, `flight_number`, `depart_date`, `depart_time`,`customer_email`) VALUES"
                            + `(?, ?, ?, ?, ?, ?)`
                            , [ticketID,airline_name,flight_number,depart_date,depart_time,email], function (err, results, fields){
                                if (err) res.json({'status': 'invaliderr'})
                                else res.json({'status': 'insertssuccessful'}) 
                            })
                        }
                    })
                } 
            }
        )

    } catch(e) {
        console.log("here");
        res.json({'status': 'invaliderr'})
    }

})

app.post('/api/customer/:custEmail/giveRating', function(req, res){
    const custEmail = req.params.custEmail
    const airline_name = req.body.airline_name
    const flight_number = req.body.flight_number
    const depart_date = req.body.depart_date.slice(0, req.body.depart_date.indexOf('T'))
    const depart_time = req.body.depart_time
    const rating = req.body.rating
    const comments = req.body.comments
    console.log(custEmail, airline_name, flight_number, depart_date, depart_time, rating, comments);
    connection.query("INSERT INTO `Rate` (`customer_email`, `airline_name`, `flight_number`, `depart_date`, `depart_time`, `rating`, `comments`) " +
    `VALUES (?, ?, ?, ?, ?, ?, ?)`, [custEmail, airline_name, flight_number, depart_date, depart_time, rating, comments], function (err, results, fields){
        console.log(results);
    })
    res.json({'status': 'success'})
})

app.get('/api/customer/:custEmail/trackMySpending', function(req, res){
    const email = req.params.custEmail
    const startDate = req.query.startDate
    const endDate = req.query.endDate
    const duration = req.query.duration
    let today = new Date();
    const dateToday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setMonth(today.getMonth() - 6)
    const date6MonthsAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setMonth(today.getMonth() - 6)
    const date1YearAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    if (startDate != undefined && endDate != undefined){
        console.log('here');
        //spending month by month in a date range
        connection.query(`
        SELECT  sum(base_price) as MonthlyTotal, MONTH(depart_date) as Month
        FROM allPurchases natural join Flight
        WHERE depart_date > ? and depart_date < ? and customer_email = ?
        group by MONTH(depart_date)
        `, [startDate,endDate,email] ,function (err, results, fields){  
            if (err) res.json({'status': 'invaliderr'})
            else{
                res.json({'results': results})
            }
        })
    }
    else if (duration === "6"){ //WHAT IS THE CONDITION?
        //past 6 months spending month by month

        connection.query(`SELECT  sum(base_price) as MonthlyTotal, MONTH(depart_date) as Month
        FROM allPurchases natural join Flight
        WHERE depart_date > ? and customer_email = ? and depart_date < ?
        group by MONTH(depart_date)
        `, [date6MonthsAgo,email, dateToday] ,function (err, results, fields){  
            if (err) res.json({'status': 'invaliderr'})
            else{
                res.json({'results': results})
            }
        })
    }
    else{
        //default view: yearTotal spending
        connection.query(`SELECT sum(base_price) as yearTotal
        FROM allPurchases NATURAL JOIN Flight
        WHERE depart_date > ? and customer_email = ? and depart_date < ?
        `, [date1YearAgo,email,dateToday] ,function (err, results, fields){ 
            if (err) res.json({'status': 'invaliderr'})
            else{
                res.json({'results': results})
            }
        })
    }
})

app.post('/api/agent/register', function(req, res){
    email = req.body.email
    password = req.body.password

    connection.query("Select * from `Agent` Where 1", function (err, results, fields){
        if (err) throw err
        else{
            agent_ID = results.length+1
            connection.query("INSERT INTO `Agent` (`email`, `password`, `agent_ID`) VALUES"+ `(?, ?, ?)`
            , [email, password, agent_ID], function (err, results, fields){
                if (err) res.json({'status': 'invalid'})
                else res.json({'status': 'registered'})  
            })
        }
    })
});

app.post('/api/agent/login', function(req, res){
    email = req.body.email
    password = req.body.password

    connection.query(`SELECT email FROM Agent WHERE email = ? and password = ?`, [email, password],function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})

        if (results.length){    //if non empty result
            console.log(results[0].email);
            const agentObj = {
                'email': results[0].email
            }
            res.json({'status': 'logged', 'agentObj': agentObj})
        }
        else{       // empty result
            res.json({'status': 'invalidempty'})  
        }
    })
})

app.get('/api/agent/:agentEmail/viewFlights', function(req, res){
    const email = req.params.agentEmail
    connection.query(`SELECT * from Agent_Purchases NATURAL JOIN Flight where agent_email = ?
    `, [email] ,function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})
        if (results.length){ //non empty result
            const flightObj = {
                email: email,
                results
            }
            res.json({
                'status': 'success',
                'flightObj': flightObj
            })
        }
        else{       // empty result
            res.json({'status': 'invalidempty'})
        }
    })
})
app.get('/api/agent/searchForFlights', function(req, res){
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const yestDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-1);
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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
    connection.query(`
    SELECT *
    FROM (allFlights NATURAL JOIN Uses NATURAL join Airplane)
    WHERE seats > (select count(*) from Ticket where airline_name = Ticket.airline_name and flight_number = Ticket.flight_number and depart_date = Ticket.depart_date and depart_time = Ticket.depart_time) 
    and depart_date > ?
    and (flight_number,airline_name,depart_date,depart_time) 
    not in (SELECT flight_number,airline_name,depart_date,depart_time from allFlights where depart_date = ? and depart_time< ? ) 
    and depart_airport_name LIKE ? 
    and arrive_airport_name LIKE ? 
    and depart_date LIKE ?
    and arrive_date LIKE  ?
    and depart_city LIKE ?
    and arrive_city LIKE ?
    `,[yestDate, date, time, obj["sourceAirport"],obj["destinationAirport"],obj["departureDate"],obj["returnDate"],obj["sourceCity"],obj["destinationCity"]] ,function (err, results, fields){
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

app.post('/api/agent/purchaseTickets', function(req, res){
    customer_email = req.body.token.email
    agent_email = req.body.obj.agent_email
    airline_name = req.body.obj.airline_name
    flight_number = req.body.obj.flight_number
    console.log('customer_email', customer_email);
    console.log('agent_email', agent_email);
    console.log('airline_name', airline_name);
    console.log('flight_number', flight_number);
    depart_date = req.body.obj.depart_date
    depart_date = depart_date.slice(0,depart_date.indexOf('T'))
    depart_time = req.body.obj.depart_time
    base_price = req.body.obj.base_price
    console.log('depart_date', depart_date);
    console.log('depart_time', depart_time);
    console.log('base_price', base_price);

    connection.query("Select email from `Customer` Where email=?", [customer_email], (err, results, fields) => {
        if (err) throw err;
        else{
            if (results.length === 0){
                connection.query("Select email from `Agent` Where email=?", [customer_email], (err, results, fields) => {
                    if (err) throw err;
                    else{
                        if (results.length){
                            res.json({'status': 'agentEmail was provided'})
                            return
                        }
                        else{
                            res.json({'status': 'no email'})
                            return
                        }
                    }
                })
            }
        }    
    })

    let ticketID = 0
    connection.query("Select * from `Ticket` Where 1", function (err, results, fields){
        if (err) throw err
        else{
            ticketID = results.length+1
            connection.query("INSERT INTO `Ticket` (`ticketID`, `airline_name`, `flight_number`, `depart_date`, `depart_time`) VALUES"+ `(?, ?, ?, ?, ?)`
            , [ticketID,airline_name,flight_number,depart_date,depart_time], function (err, results, fields){
                console.log(ticketID);
                if (err) throw err;
                
            })
            
            connection.query("INSERT INTO `Agent_Purchases` (`agent_email`, `customer_email`, `ticketID`, `airline_name`, `flight_number`, `depart_date`, `depart_time`) VALUES"
            + `(?, ?, ?, ?, ?, ?,?)`
            , [agent_email, customer_email, ticketID,airline_name,flight_number,depart_date,depart_time], function (err, results, fields){
                console.log("~~~~~~~~~~")
                console.log(agent_email);
                console.log(customer_email)
                if (err) {
                    console.log(err);
                    res.json({'status': 'invaliderr'})
                }
                else res.json({'status': 'insertssuccessful'}) 
            })
        }
    })
})

app.get('/api/agent/:agentEmail/viewMyCommission', function(req, res){
    const agent_email = req.params.agentEmail
    const startDate = req.query.startDate
    const endDate = req.query.endDate
    const today = new Date();
    const dateToday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setMonth(today.getMonth() - 1)
    const date1MonthAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    if (startDate == undefined && endDate == undefined){
        connection.query(`SELECT Sum(base_price*.1) as totalCommission, avg(base_price*.1) as avgCommission, count(base_price) as ticketsSold
        FROM Agent_Purchases NATURAL JOIN Flight
        WHERE depart_date >= ? and depart_date < ? and agent_email = ?
        `, [date1MonthAgo, dateToday, agent_email], function (err, results, fields){
            if (err) res.json({'status': 'invaliderr'})
            else res.json({'email': agent_email, 
                            'results': results})
        })
    }
    else{
        connection.query(`SELECT Sum(base_price*.1) as totalCommission, count(base_price) as ticketsSold
        FROM Agent_Purchases NATURAL JOIN Flight
        WHERE depart_date >= ? and depart_date < ? and agent_email = ?
        `, [startDate, endDate, agent_email], function (err, results, fields){
            if (err) res.json({'status': 'invaliderr'})
            else res.json({'email': agent_email, 
                            'results': results})
        })
    }
})

app.get('/api/agent/:agentEmail/topCustomers', function(req, res){
    const agent_email = req.params.agentEmail
    var resObj = {}
    connection.query(`
    SELECT customer_email, count(customer_email) as  ticketsBought
    FROM Agent_Purchases NATURAL JOIN Flight
    where agent_email = ?
    GROUP BY customer_email
    order by count(customer_email) desc
    limit 5
    `, [agent_email], function (err, results, fields){
        if (err) throw err
        else{
            resObj = {"ticketsBought": results}
            connection.query(`
            SELECT customer_email, (sum(base_price)*.1) as commissionReceived
            FROM Agent_Purchases NATURAL JOIN Flight
            where agent_email = ?
            GROUP BY customer_email
            order by count(customer_email) desc
            limit 5
            `, [agent_email], function (err, results, fields){
                if (err) throw err
                else{
                    resObj["commissionReceived"] = results  
                    console.log(resObj)
                    res.json(resObj)
                }
            })    
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