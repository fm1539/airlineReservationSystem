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
  host     : 'bht5nlo6upctnbmxntso-mysql.services.clever-cloud.com',
  user     : 'uzvcitr36qb3fwiw',
  password : 'gnm9ZRsUBFPCoy95Edkn',
  database : 'bht5nlo6upctnbmxntso'
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
    console.log(req.body.email);
    
    var arr = [req.body.email,req.body.name,req.body.password,req.body.building_number,req.body.street,req.body.city,req.body.state,
        req.body.phone_number,req.body.passport_number,req.body.passport_expiration,req.body.passport_country,req.body.date_of_birth]
    let dynamic = ''
    arr.forEach((element, index) => {
        if (index == arr.length-1){
            dynamic += element
        } else{
            dynamic += element + ','
        }
});

    const begin = 'INSERT INTO `Customer` (`email`,`name`,`password`,`building_number`,`street`,`city`,`state`,`phone_number`,`passport_number`,`passport_expiration`,`passport_country`,`date_of_birth`)'
    
    connection.query(begin + ' VALUES (' + dynamic + ')', function (err, results, fields){
        if (err) throw err;
        res.json({'status': 'registered'})
    })
    res.json({'status': 'invalid'})
})



app.get('/api/:airLineID', function(req, res){      // the colon makes it so its flexible
    console.log(req.params.airLineID)               //this prints the users parameter
    const airLineName = req.params.airLineID
    const obj = {
        airLineName: database[airLineName]
    }
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