const express = require('express')  //import
const bodyParser = require('body-parser')   //import

const app = express()               // creating an instance of express

app.use(bodyParser.json())          //allows to send json //allows.json method

let database = {
    'delta': {
        'airplanes': 4,
        'location': 'NYC'
    },
    'united': {
        'airplanes': 2,
        'location': 'New Jersey'
    }
}

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