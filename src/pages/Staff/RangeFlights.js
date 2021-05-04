import {React, useState, useEffect}  from 'react'
import axios from 'axios'
import Sidebar from '../../shared/Sidebar'
import NavBar from '../../shared/NavBar'
import {sLogout, sCheckLoggedIn} from '../../global/Reducer'
import {InputGroup, FormControl, Modal, Button, Card, Tab, Tabs} from 'react-bootstrap'
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
    const [statusPopup, setStatusPopup] = useState(false)
    const [status, setStatus] = useState({
        customers: []
    })

    const rowInfoHandler = (obj) => {
        console.log(obj);
        setStatus(obj)
    //     setStatus({
    //     ...status,
    //     ['customers']: obj.customers

    // })
    }
    const showChangeStatusPopup = () => setStatusPopup(true)
    const hideChangeStatusPopup = () => setStatusPopup(false)

    const statusChangeHandler = (event) => {
        setStatus({
            ...status,
            [event.target.name]: event.target.value
        })
    }

    const [searchResults, setSearchResults] = useState([])
    const searchResultsHandler = (arr) => setSearchResults(arr)

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const handleShow = () => setShow(true);

    const handleShow2 = () => setShow2(true);

    const [cities, setCities] = useState([])
    const [airports, setAirports] = useState([])

    const searchChangeHandler = (event) => {
        setSearchInput({
            ...searchInput,
            [event.target.name]: event.target.value
        })
    }

    const cityHandler =(arr) => setCities(arr)
    const airportHandler = (arr) => setAirports(arr)
    
    const changeButtonHandler = () => {
        console.log('status', status);
        axios.post('http://localhost:8000/api/staff/changeStatus', status).then(response => {
            console.log(response);
            // window.location = '/staff'
    })   
    }

    const [ratingObj, setRating] = useState({})
    
    const ratingsHandler = (obj) =>{
        console.log(obj.ratings);
        setRating(obj)        
    }
    
    const changeStatus = {
        onClick: (e, row, rowIndex) => {
          //save specific row info to a state
          console.log(row);
          rowInfoHandler(row)
          const query = '?airline_name='+row.airline_name+'&flight_number='+row.flight_number+'&depart_date='+row.depart_date+'&depart_time='+row.depart_time
          axios.get('http://localhost:8000/api/staff/viewRatings'+query).then(response => {
            console.log(response.data);
            ratingsHandler(response.data)
        })
          //have modal pop up to add review and submit
          showChangeStatusPopup()
        }
      };

    useEffect(()=> {
        axios.get('http://localhost:8000/api/customer/getAllAirports').then( response => airportHandler(response.data.results))

        axios.get('http://localhost:8000/api/customer/getAllCities').then( response => cityHandler(response.data.results)) 
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
        axios.post('http://localhost:8000/api/staff/viewFlights', obj).then(response => {
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
    if (sCheckLoggedIn()) loggedIn = true
    

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

    let pT = "200px"
    if (searchResults.length > 0) pT = '100px'

    return (
        <div>
            <NavBar 
                nav={[['/aViewFlights', 'View My Flights'], ['/viewTop', 'View Top Customers'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}   
                logOut = {sLogout}
                logoPath="/staff"
            />
            <Modal show={statusPopup} onHide={hideChangeStatusPopup}>
                <Modal.Header closeButton>
                <Modal.Title>Change Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="customers" id="uncontrolled-tab-example">
                        <Tab eventKey="customers" title="Customers">
                            {
                                status.customers.map((customer)=>{
                                    return (
                                        <p>{customer.customer_email}</p>
                                    )
                                })
                            
                            }
                        </Tab>
                        <Tab eventKey="status" title="Change Status">
                            <form>
                                <label>New Status</label>
                                <br/>
                                <select id="changeStatus" name="status" onChange={statusChangeHandler}>
                                    <option></option>
                                    <option value="ontime">On Time</option>
                                    <option value="delayed">Delayed</option>
                                </select>
                            </form>

                        </Tab>
                        <Tab eventKey="reviews" title="Reviews">
                            <h2>{ratingObj.avgRating}</h2>
                            {
                                ratingObj.ratings !== undefined ?
                                ratingObj.ratings.map((rating)=>{
                                    return (
                                    <div>
                                        <h6>{rating.customer_email}</h6>
                                        <p style={{textAlign: 'left'}}>{rating.comments}</p>
                                        <p style={{textAlign: 'left'}}>{rating.rating}</p>
                                    </div>
                                    )
                                })
                                :null
                            }
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={hideChangeStatusPopup}>
                    Close
                </Button>
                <Button variant="primary" onClick={changeButtonHandler}>
                    Change
                </Button>
                </Modal.Footer>
            </Modal>

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
                rowEvents={changeStatus}
                />
                :null
                }

            </div>
        </div>
    )
}

export default RangeFlights