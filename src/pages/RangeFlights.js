import {React, useState, useEffect}  from 'react'
import axios from 'axios'
import Sidebar from '../shared/Sidebar'
import NavBar from '../shared/NavBar'
import {sLogin, sLogout, sCheckLoggedIn, sRegister} from '../global/Reducer'
import {InputGroup, FormControl, Modal, Button, Card, Container, Row, Col} from 'react-bootstrap'
import paginationFactory from 'react-bootstrap-table2-paginator'
import BootstrapTable from 'react-bootstrap-table-next'

//call axious req


function RangeFlights(){
    const [searchInput, setSearchInput] = useState({
        leaving: "",
        going: "",
        depart_date: "",
        arrive_date: ""
    }) 

    const [searchResults, setSearchResults] = useState([1])

    const searchResultsHandler = (arr) => {
        setSearchResults(arr)
    }

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [cities, setCities] = useState([])
    const [airports, setAirports] = useState([])

    const searchChangeHandler = (event) => {
        setSearchInput({
            ...searchInput,
            [event.target.name]: event.target.value
        })
    }

    const cityHandler =(arr) => {
        setCities(arr)
    }

    const airportHandler = (arr) => {
        setAirports(arr)
    }

    useEffect(()=> {
        axios.get('http://localhost:8000/api/customer/getAllAirports').then( response => {
            console.log(response.data.results);
            airportHandler(response.data.results)
        })

        axios.get('http://localhost:8000/api/customer/getAllCities').then( response => {
            console.log(response.data);
            cityHandler(response.data.results)
        }) 
    }, [])

    const searchButtonHandler = () => {
        let obj = {
            "sourceCity": "",
            "sourceAirport": "",
            "destinationCity": "",
            "destinationAirport": "",
            "departureDate": ""
        }
        if (cities.includes(searchInput.leaving)) obj["sourceCity"] = searchInput.leaving;
        else if (airports.includes(searchInput.leaving)) obj["sourceAirport"] = searchInput.leaving;

        if (cities.includes(searchInput.going)) obj["destinationCity"] = searchInput.going;
        else if (airports.includes(searchInput.going)) obj["destinationAirport"] = searchInput.going;

        let query = ""
        
        for (var key in obj){
            if (obj[key] !== "")  query += key + "=" + obj[key] + '&'
        }
        query = query.slice(0, query.length-1)

        axios.get('http://localhost:8000/api/customer/getAllAirports').then(response => {
            console.log(response);
        })
        
        window.location = "/searchResults?" + query

    }
    
    let loggedIn = false
    if (sCheckLoggedIn()){
        loggedIn = true
    }

    const columns = [
        { dataField: "ticketID", text: 'Ticket ID' },
        { dataField: "flight_number", text: 'Flight #'},
        { dataField: "airline_name", text: 'Airline Name'},
        // { dataField: "depart_date", text: 'Departure Date'},
        // { dataField: "depart_time", text: 'Departure Time'},
        // { dataField: "arrive_date", text: 'Arrival Date'},
        // { dataField: "arrive_time", text: 'Arrival Time'},
        // { dataField: "depart_airport_name", text: 'Leaving From'},
        // { dataField: "arrive_airport_name", text: 'Arriving To'},
        // { dataField: "base_price", text: 'Base Price'}
    ]
    const data = [
        {ticketID: 1, flight_number: 1, airline_name: 'Delta'},
        {ticketID: 1, flight_number: 1, airline_name: 'Delta'},
        {ticketID: 1, flight_number: 1, airline_name: 'Delta'},
        {ticketID: 1, flight_number: 1, airline_name: 'Delta'}
    ]
    let pT = "200px"
    if (searchResults.length > 0){
        pT = '100px'
    }

    return (
        <div>
            <NavBar 
                nav={[['/aViewFlights', 'View My Flights'], ['/viewTop', 'View Top Customers'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}   
                logOut = {sLogout}
                logoPath="/staff"
            />
            <Sidebar />
            <div style={{marginLeft: '270px', paddingTop: pT}}>
                <Card style={{boxShadow: '0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)', width:'50%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Card.Body>
                        <Card.Title style={{'textAlign': 'left'}}>Search Flights</Card.Title>
                        <div style={{'display': 'flex'}}>
                            <InputGroup className="mb-3" style={{'width': '50%'}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">Leaving</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                placeholder="From"
                                aria-label="Username"
                                name="leaving"
                                onChange={searchChangeHandler}
                                aria-describedby="basic-addon1"
                                />
                            </InputGroup>
                            <div style={{'width': '10px'}}> </div>
                            <InputGroup className="mb-3" style={{'width': '50%'}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">Going</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                placeholder="To"
                                aria-label="Username"
                                name="going" onChange={searchChangeHandler}
                                aria-describedby="basic-addon1"
                                />
                            </InputGroup>
                        </div>
                        <br/>
                        <label for="depart_date">Departure Date: </label>
                        <br/>
                        <input name="depart_date" type="date" onChange={searchChangeHandler}/> <br/><br/>
                        <label for="arrive_date">Arrival Date: </label>
                        <br/>
                        <input name="arrive_date" type="date" onChange={searchChangeHandler}/> <br/><br/>
                        <Button onClick={searchButtonHandler}>Search</Button>
                    </Card.Body>
                </Card>
                {searchResults.length>0 ? 
                <BootstrapTable class="table-hover"
                keyField="name"
                data={data}
                columns={columns}
                pagination={paginationFactory()}
            />
                :null
                }

            </div>
        </div>
    )
}

export default RangeFlights