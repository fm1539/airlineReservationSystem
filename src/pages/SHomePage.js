import React, {useState, useEffect} from 'react'
import NavBar from '../shared/NavBar'
import axios from 'axios'
import {InputGroup, FormControl, Modal, Button, Card, Container, Row, Col} from 'react-bootstrap'
import {sLogin, sLogout, sCheckLoggedIn, sRegister} from '../global/Reducer'
import Sidebar from '../shared/Sidebar'
import paginationFactory from 'react-bootstrap-table2-paginator'
import BootstrapTable from 'react-bootstrap-table-next'

function SHomePage(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)
 
    const [loginEvent, setLoginEvent] = useState({
        username: "",
        password: "",
    })


    // useEffect(()=> {
    //     axios.get('http://localhost:8000/api/staff/viewFlights').then( response => {
    //         console.log(response.data.results);
    //         airportHandler(response.data.results)
    //     })
    // }, [])

    const loginChangeHandler = (event) => {
        setLoginEvent({
            ...loginEvent, 
            [event.target.name]: event.target.value
        })
    }

    const loginButtonHandler = () => {
        console.log(loginEvent);
        sLogin(loginEvent, '/staff')
    }

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

    const registerButtonHandler = () => {
        console.log(registerEvent);
        sRegister(registerEvent, '/staff')
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    let custInfo = <p>Loading...</p>

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
                        <input type="text" name="airline_name" placeholder="Airline Name" onChange={registerChangeHandler} required/>
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
                            data={data}
                            columns={columns}
                            pagination={paginationFactory()}
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