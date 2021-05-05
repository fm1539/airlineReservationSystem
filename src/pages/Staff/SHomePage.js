import React, {useState, useEffect} from 'react'
import NavBar from '../../shared/NavBar'
import axios from 'axios'
import {Modal, Button, Tab, Tabs} from 'react-bootstrap'
import {sLogin, sLogout, sCheckLoggedIn, sRegister} from '../../global/Reducer'
import Sidebar from '../../shared/Sidebar'
import paginationFactory from 'react-bootstrap-table2-paginator'
import BootstrapTable from 'react-bootstrap-table-next'

function SHomePage(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)
    const [airports, setAirports] = useState([])
    const [allFlights, setAllFlights] = useState([])
    const [statusPopup, setStatusPopup] = useState(false)
    const [airlines, setAllAirlines] = useState([])
    const [status, setStatus] = useState({
        customers: []
    })
    const [flight, setFlight] = useState({
        departDate: "", departTime: "", arriveDate: "" , arriveTime: "",
        arriveAirport: "", departAirport: "", basePrice: "", status: ""
    })
    
    const rowInfoHandler = (obj) => setStatus(obj)
    const showChangeStatusPopup = () => setStatusPopup(true)
    const hideChangeStatusPopup = () => setStatusPopup(false)
    const allFlightsHandler = (arr) => setAllFlights(arr)
    const airportHandler = (arr) => setAirports(arr)
    
    const flightChangeHandler= (event) => {
        setFlight({
            ...flight,
            [event.target.name]: event.target.value
        })
    }

    const airlineHandler = (arr) => {
        setAllAirlines(arr)
    }

    useEffect(()=> {
        if (flight.arriveAirport !== ""){
            let index = 0
            for (let i = 0; i < airports.length; i++){
                if (airports[i][0] === flight.arriveAirport){
                    index = i
                    break
                }
            }
            let newAirports = [...airports];
            for (let i = 0; i < airports.length; i++){
                if (newAirports[i][0] !== flight.departAirport){
                    newAirports[i][1] = true
                    newAirports[i][2] = true
                }
            }
            newAirports[index][1] = false;
            setAirports(newAirports);
            // airports[index][1] = false
        }

        if (flight.departAirport !== ""){
            let index = 0
            for (let i = 0; i < airports.length; i++){
                if (airports[i][0] === flight.departAirport){
                    index = i
                    break
                }
            }
            let newAirports = [...airports];
            for (let i = 0; i < airports.length; i++){
                if (newAirports[i][0] !== flight.arriveAirport){
                    newAirports[i][1] = true
                    newAirports[i][2] = true
                }
            }
            newAirports[index][2] = false;
            setAirports(newAirports);
            // airports[index][1] = false
        }
    }, [flight])
 
    const [loginEvent, setLoginEvent] = useState({
        username: "",
        password: "",
    })
    let loggedIn = false
    if (sCheckLoggedIn()) loggedIn = true

    useEffect(()=> {
        if (loggedIn){
            const obj ={
                'airline_name': JSON.parse(localStorage.getItem('staffObj')).airline_name
            }
            console.log('obj', obj);
            axios.post('http://localhost:8000/api/staff/viewFlights', obj).then(response =>{
                console.log('viewmyflights', response);
                let arr = []
                if (response.data.status !== "invalidempty"){
                    response.data.results.forEach(obj => {
                        arr.push({
                            ...obj,
                            ['depart_date']: obj['depart_date'].slice(0, obj['depart_date'].indexOf('T')),
                            ['arrive_date']: obj['arrive_date'].slice(0, obj['arrive_date'].indexOf('T'))
                        })
                    });
            }
                allFlightsHandler(arr)
            })
        
            axios.get('http://localhost:8000/api/staff/getAllAirports').then( response => {
                console.log(response)
                let arr = []
                response.data.results.forEach(airport => {
                    arr.push([airport.name, true, true])
                });
                airportHandler(arr)
            })
        }
        else{
            axios.get('http://localhost:8000/api/staff/getAllAirlines').then(response => {
                console.log(response);
                if (response.data.status === "success"){
                    airlineHandler(response.data.airlines)
                }
            })
        }
    }, [])

    const loginChangeHandler = (event) => {
        setLoginEvent({
            ...loginEvent, 
            [event.target.name]: event.target.value
        })
    }

    const loginButtonHandler = () => sLogin(loginEvent, '/staff')
    
    const [registerEvent, setRegisterEvent] = useState({
        username: "", 
        password: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        airline_name: ""
    })

    const registerChangeHandler = (event) => {
        setRegisterEvent({
            ...registerEvent,
            [event.target.name]: event.target.value
        })
    }

    useEffect(()=>{
        console.log('status', status);
    }, [status])

    const registerButtonHandler = () => sRegister(registerEvent, '/staff')
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const statusChangeHandler = (event) => {
        setStatus({
            ...status,
            [event.target.name]: event.target.value
        })
    }

    const changeButtonHandler = () => {
        console.log('status', status);
        axios.post('http://localhost:8000/api/staff/changeStatus', status).then(response => {
            // window.location = '/staff'
        })   
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
    
    const changeStatus = {
        onClick: (e, row, rowIndex) => {
          console.log(allFlights);
          //save specific row info to a state
          rowInfoHandler(row)

          //have modal pop up to add review and submit
          showChangeStatusPopup()
        }
    };

    return (
        <React.Fragment>
            {loggedIn ? <NavBar 
                nav={[['/aViewFlights', 'View My Flights'], ['/viewTop', 'View Top Customers'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {sLogout}
                logoPath="/staff"
            />
            :
            <NavBar 
                nav={[['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {sLogout}
                logoPath="/staff"
            />
        }
            
            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Username</label>
                        <br/>
                        <input type="email" name="username" placeholder="Email" onChange={loginChangeHandler} autocomplete="chrome-off" required/>
                        <br/>
                        <br/>
                        <label>Password</label>
                        <br/>
                        <input type="password" name="password" placeholder="Password" onChange={loginChangeHandler} autocomplete="chrome-off" required/>
                        <br /><br />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={loginButtonHandler}>
                    Sign In
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Username</label>
                        <br/>
                        <input type="text" name="username" placeholder="Username" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Password</label>
                        <br/>
                        <input type="password" name="password" placeholder="Password" onChange={registerChangeHandler} required/>
                        <br /><br />
                        <label>First Name</label>
                        <br/>
                        <input type="text" name="first_name" placeholder="First Name" onChange={registerChangeHandler} required/>
                        <br /><br />
                        <label>Last Name</label>
                        <br/>
                        <input type="text" name="last_name" placeholder="Last Name" onChange={registerChangeHandler} required/>
                        <br /><br />
                        <label>Date of Birth</label>
                        <br/>
                        <input type="date" name="date_of_birth" placeholder="Date" onChange={registerChangeHandler} required/>
                        <br /><br />
                        <label>Airline Name</label>
                        <br/>
                        <select name="airline_name" onChange={registerChangeHandler}>
                            <option></option>
                            {
                            airlines.map((airline) => {
                                return (
                                    <option value={airline.name}>{airline.name}</option>
                                )
                            })
                              
                            }
                        </select>
                        <br /><br />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                    Close
                </Button>
                <Button variant="primary" onClick={registerButtonHandler}>
                    Sign Up
                </Button>
                </Modal.Footer>
            </Modal>
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

            {/* <ProSidebar>
                <Menu iconShape="square">
                    <MenuItem >Dashboard</MenuItem>
                    <SubMenu title="Components" >
                    <MenuItem>Component 1</MenuItem>
                    <MenuItem>Component 2</MenuItem>
                    </SubMenu>
                </Menu>
            </ProSidebar> */}
            {loggedIn?
                <div>
                    <Sidebar />
                    <div style={{marginLeft: '270px'}}>
                        <BootstrapTable class="table-hover"
                            keyField="name"
                            data={allFlights}
                            columns={columns}
                            pagination={paginationFactory()}
                            rowEvents = { changeStatus }
                        />
                    </div>
                </div>
                :
                <div style={{marginLeft: '270px'}}>
                    <h1 style={{textAlign: 'left'}}>Please Log In</h1>
                </div>
            }
        </React.Fragment>
    )
}

export default SHomePage