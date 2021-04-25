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

    const [searchResults, setSearchResults] = useState([])

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
            'airline_name': JSON.parse(localStorage.getItem('staffObj')).airline_name,
            "startDate": searchInput.depart_date,
            "endDate": searchInput.arrive_date
        }
        if (cities.includes(searchInput.leaving)) obj["depart_city"] = searchInput.leaving;
        else if (airports.includes(searchInput.leaving)) obj["depart_airport_name"] = searchInput.leaving;

        if (cities.includes(searchInput.going)) obj["arrive_city"] = searchInput.going;
        else if (airports.includes(searchInput.going)) obj["arrive_airport_name"] = searchInput.going;
        console.log(obj);
        axios.post('http://localhost:8000/api/staff/viewFlights', obj).then(response => {
            console.log(response);
            let arr = []
            response.data.results.forEach(obj => {
                arr.push({
                    ...obj,
                    ['depart_date']: obj['depart_date'].slice(0, obj['depart_date'].indexOf('T')),
                    ['arrive_date']: obj['arrive_date'].slice(0, obj['arrive_date'].indexOf('T'))
                })
            });
            searchResultsHandler(arr)
        })
    }
    
    let loggedIn = false
    if (sCheckLoggedIn()){
        loggedIn = true
    }

    const columns = [
        { dataField: "airline_name", text: 'Airline Name' },
        { dataField: "depart_airport_name", text: 'Departure Airport'},
        { dataField: "arrive_airport_name", text: 'Arrival Airport'},
        { dataField: "depart_city", text: 'Departure City'},
        { dataField: "arrive_city", text: 'Arrival City'},
        { dataField: "depart_date", text: 'Departure Date'},
        { dataField: "arrive_date", text: 'Arrival Date'},
        { dataField: "depart_time", text: 'Departure Time'},
        { dataField: "arrive_time", text: 'Arrival Time'},
        { dataField: "base_price", text: 'Base Price'},
        { dataField: "flight_number", text: 'Flight Number'},
        { dataField: "status", text: 'Status'},
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
                data={searchResults}
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