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


var connection = require('mysql2-promise')();

connection.configure({
  host     : 'bhvnh1znohtkeluykr2r-mysql.services.clever-cloud.com',
  user     : 'ubsbqvfcyngpgwfb',
  password : 'JGwD07olU9zwGKAWnliE',
  database : 'bhvnh1znohtkeluykr2r'
});

//connection.connect();

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
    console.log(req.query);
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
    console.log(obj)

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

app.post('/api/staff/register', function(req, res){
    const username = req.body.username
    const password = req.body.password
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const date_of_birth = req.body.date_of_birth
    const airline_name = req.body.airline_name
    console.log('username', username);
    console.log('password', password);
    console.log('fist_name', first_name);
    console.log('last_name', last_name);
    console.log('birth', date_of_birth);
    console.log('airline', airline_name);
    connection.query("INSERT INTO `Airline_Staff` (`username`,`password`, `first_name`, `last_name`, `date_of_birth`, `airline_name`)" + ` VALUES (?,?,?,?,?,?)
    `,[username, password, first_name, last_name, date_of_birth, airline_name], function (err, results, fields){
        if (err) res.json({'status': 'invalid'})
        else res.json({'status': 'registered'})  
    })
})

app.post('/api/staff/login', function(req, res){
    username = req.body.username
    password = req.body.password

    connection.query(`SELECT username, airline_name FROM Airline_Staff WHERE username = ? and password = ?`, [username, password],function (err, results, fields){
        if (err) res.json({'status': 'invaliderr'})

        if (results.length){    //if non empty result
            console.log(results[0].email);
            const staffObj = {
                'username': results[0].username,
                'airline_name': results[0].airline_name
            }
            res.json({'status': 'logged', 'staffObj': staffObj})
        }
        else{       // empty result
            res.json({'status': 'invalidempty'})  
        }
    })
})



app.post('/api/staff/viewFlights', function(req, res){ 
    let airline_name = req.body.airline_name
    console.log('airline_name', airline_name);
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let depart_airport_name = req.body.depart_airport_name
    let arrive_airport_name = req.body.arrive_airport_name
    let depart_city = req.body.depart_city
    let arrive_city = req.body.arrive_city

    let today = new Date();
    const dateToday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setMonth(today.getMonth() + 1)
    const dateIn1Month = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(dateToday, dateIn1Month, airline_name)

    if (startDate == undefined){ //if we are not give a range, the default range is the next month
        startDate = dateToday
        endDate = dateIn1Month
    }
    if (depart_airport_name == undefined) depart_airport_name = "%"
    if (arrive_airport_name == undefined) arrive_airport_name = "%"
    if (depart_city == undefined) depart_city = "%"
    if (arrive_city == undefined) arrive_city = "%"
    // console.log(airline_name)
    // console.log(startDate)
    // console.log(endDate)
    // console.log(depart_airport_name)
    // console.log(arrive_airport_name)
    // console.log(depart_city)
    // console.log(arrive_city)
    connection.query(`
    select *
    from allFlights
    where airline_name = ? and depart_date > ? and depart_date < ?
    and depart_airport_name LIKE ? 
    and arrive_airport_name LIKE ? 
    and depart_city LIKE ?
    and arrive_city LIKE ?
    `,[airline_name, startDate, endDate, depart_airport_name, arrive_airport_name, depart_city, arrive_city] ,function (err, results, fields){
        console.log(results);
        if (err) res.json({'status': 'invalid'})
        else if(results.length == 0) res.json({'status': 'invalidempty'}) 
        else {
            let k = 0
            for (var j = 0; j < results.length; j++) {
                var result = [];
                var  getInformationFromDB = function(j, callback) {

                    connection.query(`SELECT customer_email
                    from allPurchases
                    where airline_name =  ?
                    and flight_number = ?
                    and depart_date = ?
                    and depart_time = ?
                    `, [results[j].airline_name, results[j].flight_number, results[j].depart_date, results[j].depart_time],function (err, results, fields){
                        if (err) return callback(err)
                        else {
                            for (var i = 0; i < results.length; i++) {
                                result.push(results[i])
                            }
                            
                        }
                        callback(null, result);  
                        result = []                      
                    })
                }
                //console.log(j)
                //console.log("Call Function");
                
                getInformationFromDB(j, function (err, result) {
                  if (err) console.log("Database error!");
                  else {
                      //console.log(results[0])
                      results[k]["customers"] = result
                      //console.log(results[0])
                      //console.log(k)
                      //console.log(result);
                      if (k === results.length-1){
                          res.json({'results': results})
                      }
                      k = k + 1
                  }
                }); 
            }   
        }
    })
})

app.post('/api/staff/createFlight', function(req, res){
    let airline_name = req.body.airline_name
    let depart_date = req.body.depart_date
    let depart_time = req.body.depart_time
    let arrive_date = req.body.arrive_date
    let arrive_time = req.body.arrive_time
    let arrive_airport_name = req.body.arrive_airport_name
    let depart_airport_name = req.body.depart_airport_name
    let base_price = req.body.base_price
    let status = req.body.status
    let airplaneID = req.body.airplaneID
    console.log('airline_name', airline_name);
    console.log('depart_date', depart_date);
    console.log('depart_time', depart_time);
    console.log('arrive_date', arrive_date);
    console.log('arrive_time', arrive_time);
    console.log('arrive airport', arrive_airport_name);
    console.log('depart_airport_name', depart_airport_name);
    console.log('base_price', base_price);
    console.log('status', status);


    connection.query("Select * from `Flight` Where 1", function (err, results, fields){
        if (err) throw err
        else{
            let flight_number = results.length+1
            connection.query("INSERT INTO `Flight` (`airline_name`, `flight_number`, `depart_date`, `depart_time`, `arrive_date`, `arrive_time`, `arrive_airport_name`, `depart_airport_name`, `base_price`, `status`)"
            + ` Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            , [airline_name, flight_number, depart_date,depart_time,arrive_date,arrive_time,arrive_airport_name,depart_airport_name,base_price,status], function (err, results, fields){
                if (err) throw err

            })
            connection.query("INSERT INTO `Uses` (`ID`,`airline_name`, `flight_number`, `depart_date`, `depart_time`)"
            + ` Values(?, ?, ?, ?, ?)`
            , [airplaneID,airline_name, flight_number, depart_date,depart_time], function (err, results, fields){
                if (err) res.json({'status': 'invalid'})
                else res.json({'status': 'inserted'})  
            })
        }
    })
});

app.post('/api/staff/changeStatus', function(req, res){
    let newStatus = req.body.status
    let airline_name = req.body.airline_name
    let flight_number = req.body.flight_number
    let depart_date = req.body.depart_date
    let depart_time = req.body.depart_time

    console.log('newStatus', newStatus);
    console.log('airline_name', airline_name);
    console.log('flight_number', flight_number);
    console.log('depart_date', depart_date);
    console.log('depart_time', depart_time);

    connection.query(`
    UPDATE \`Flight\` SET \`status\` = ? WHERE \`airline_name\` = ? AND \`flight_number\` = ? AND \`depart_date\` = ? AND \`depart_time\` = ? 
    `,[newStatus,airline_name,flight_number,depart_date,depart_time] ,function(err, results, fields) {
        if (err) res.json({'status': 'invaliderr'})
        else res.json({'status': 'updated'})  
    })
})

app.post('/api/staff/addAirplane', function(req, res){
    let airline_name = req.body.airline_name
    let seats = req.body.seats

    connection.query("Select * from `Airplane` Where 1", function (err, results, fields){
        if (err) throw err
        else{
            let airplaneID = results.length+1
            connection.query("INSERT INTO `Airplane` (`ID`, `airline_name`, `seats`)"
            + ` Values(?, ?, ?)`
            , [airplaneID, airline_name, seats], function (err, results, fields){
                if (err) res.json({'status': 'invalid'})
                else res.json({'status': 'inserted'})  

            })
        }
    })
});
//get all airplanes owned by a specified airline
app.get('/api/staff/getAllAirplanes', function(req, res){
    let airline_name = req.query.airline_name
    if (airline_name == undefined)
        airline_name = '%'
    connection.query(`Select ID from Airplane where airline_name Like ?`
    , [airline_name], function (err, results, fields){
        if (err) res.json({'status': 'invalid'})
        else res.json({'ownedAirplanes': results})
    })
})

app.get('/api/staff/viewRatings', function(req, res){
    const obj ={
        'airline_name' : req.query.airline_name,
        'flight_number' : req.query.flight_number,
        'depart_date' : req.query.depart_date,
        'depart_time' : req.query.depart_time
    }

    for (var key in obj){
        if (obj[key] === undefined){
            obj[key] = '%'
        }
    }
    connection.query(`SELECT customer_email, rating, comments FROM Rate WHERE 
    airline_name Like ? AND
    flight_number Like ? AND
    depart_date Like ? AND
    depart_time Like ? `
    , [obj['airline_name'],obj['flight_number'], obj['depart_date'], obj['depart_time']], function (err, results, fields){
        if (err) throw err
        else {
            ratingsObj = {'ratings':results}
            connection.query(`
            SELECT AVG(rating) as avgRating
            FROM Rate WHERE 
            airline_name Like ? AND
            flight_number Like ? AND
            depart_date Like ? AND
            depart_time Like ?
            GROUP by airline_name,flight_number,depart_date,depart_time
            `
            , [obj['airline_name'],obj['flight_number'], obj['depart_date'], obj['depart_time']], function (err, results, fields){
                if (err) res.json({'status': 'invalid'})
                else if (!results.length){
                    res.json('invalidempty')
                }
                else{
                    ratingsObj['avgRating'] = results[0].avgRating
                    res.json(ratingsObj)
                }
            })
        }
    })
})

app.post('/api/staff/topAgents', function(req, res){
    let timeFlag = req.body.timeFlag //"month" or "year" for the first query
    airline_name = req.body.airline_name
    let today = new Date();
    today.setMonth(today.getMonth() - 1)
    const date1MonthAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setMonth(today.getMonth() - 11)
    const date1YearAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let depart_date;
    if (timeFlag == "month") {
        depart_date = date1MonthAgo
    }
    else{ 
        depart_date = date1YearAgo }
    connection.query(`
    SELECT agent_email, count(agent_email) as ticketsSold
    FROM Agent_Purchases
    where depart_date > ? and airline_name = ? 
    GROUP by agent_email
    order by count(*) desc
    limit 5
    `
    , [depart_date, airline_name], function (err, results, fields){
        if (err) throw err
        else{
            topAgentObj = {"topAgentByTicketsSold": results}
            connection.query(`
            SELECT agent_email, sum(base_price)*.1 as commissioned
            FROM Agent_Purchases NATURAL join Flight
            where depart_date > ? and airline_name = ? 
            GROUP by agent_email
            order by sum(base_price) desc
            limit 5
            `
            , [date1YearAgo, airline_name], function (err, results, fields){
                if (err) res.json({'status': 'invalid'})
                else{
                    topAgentObj["topAgentByCommission"] = results
                    res.json(topAgentObj)
                }
            })
        }
    })
})

app.get('/api/staff/frequentCustomer', function(req, res){
    //let customer_email = req.body.customer_email
    let airline_name = req.body.airline_name
    let today = new Date();
    console.log("start")
    today.setFullYear(today.getFullYear() - 1)
    const date1YearAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    connection.query(`SELECT distinct flight_number
    FROM allPurchases
    WHERE airline_name = ?
    `, [airline_name],  async function (err, results1, fields){ // results = [flight #s]
        if (err) throw err
        else{
            console.log("here");
            if (results1.length){
                resultsObj = {}
                console.log('results1', results1);
                let key;
                for (let i = 0; i < results1.length; i++){
                    key = results1[i].flight_number
                    console.log('2nd', results1[i].flight_number);
                    try{
                    let [row, fields] = await connection.execute(`Select distinct customer_email from allPurchases where flight_number = ?
                    `, [key])
                    resultsObj[key] = results2
                    console.log('row', row);
                    console.log('fields', fields);
                    }
                    catch(err){
                        console.log(err);
                    }
                }
                console.log('resultsObj-outsideloop', resultsObj);
                res.json(resultsObj)
            }
        }
    })
})
    /*
    connection.query(`
    SELECT customer_email, count(*) as purchases
    FROM allPurchases
    WHERE airline_name = ? and depart_date > ?
    GROUP by customer_email
    order by count(*) desc
    limit 1
    `
    , [airline_name, date1YearAgo], function (err, results, fields){
        if (err) throw err
        else {
            frequentCustomerObj = {"frequentCustomer": results[0]}
            //removed this from where statment:  and customer_email = ?
            connection.query(`
            SELECT *
            FROM allPurchases
            WHERE airline_name = ?
            `
            ,[airline_name], function (err, results, fields){
                if (err) res.json({'status': 'invalid'})
                else{
                    frequentCustomerObj["airlinesFlights"] = results
                    res.json(frequentCustomerObj)
                }
            })
        }
    })
    */
// })

app.get('/api/staff/viewReports', function(req, res){
    let airline_name = req.body.airline_name
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let timeFlag = req.body.timeFlag //can be last "month" or last "year"
    let today = new Date();
    const dateToday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setMonth(today.getMonth() - 1)
    const date1MonthAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setMonth(today.getMonth() - 11)
    const date1YearAgo = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    if (timeFlag == "month"){
        startDate = date1MonthAgo
        endDate = dateToday
    }
    if (timeFlag == "year"){
        startDate = date1YearAgo
        endDate = dateToday
    }
    console.log("startDate", startDate)
    console.log("endDate", endDate)
    connection.query(`
    SELECT MONTH(depart_date) as month,count(*) as ticketsSold
    FROM allPurchases
    where depart_date >  ? and depart_date < ? and airline_name = ? 
    group by MONTH(depart_date)
    `
    ,[startDate,endDate, airline_name], function (err, results, fields){
        if (err) res.json({'status': 'invalid'})
        else res.json(results)  
    })
})

app.post('/api/staff/addAirport', function(req, res){
    let airportName = req.body.airportName
    let airportCity = req.body.airportCity
    connection.query(`INSERT INTO \`Airport\` (\`name\`, \`city\`) VALUES (?, ?)`
    ,[airportName, airportCity], function (err, results, fields){
        if (err) res.json({'status': 'invalid'})
        else res.json({'status': 'inserted'})  
    })
})



app.get('/api/:airLineID', function(req, res){      // the colon makes it so its flexible
    console.log(req.params.airLineID)               //this prints the users parameter
    const airLineName = req.params.airLineID
    const obj = { airLineName: database[airLineName] }
    res.json(obj)                  
    //res.send(req.params.airLineID)   //prints the user's parameter to their browser //res is "resposne you want to send back"
})

app.get('/api/staff/getAllAirports', function(req, res){
    connection.query(`select * from Airport`, function(err, results, fields) {
        if (err) res.json({'status': 'invaliderr'})
        else res.json({'results': results})
    })
})

// app.get('/md', function(request, response){   //goes to route /md 
//     const name = 'John'
//     //response.send('<h1>Hello John</h1>')            //response.send is like the return statement this printed to http://localhost:8000/md
//     response.render('home', {name})              //we are passing name into home.ejs, We are injecting information into the front end
// })

app.listen(8000, function(){            //designate which port you want to run
    console.log("server on 8000");
})