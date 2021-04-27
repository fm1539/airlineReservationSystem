import React, {useEffect, useState} from 'react'
import NavBar from '../shared/NavBar'
import axios from 'axios'
import {login, logout, checkLoggedIn, register} from '../global/Reducer'
import {Modal, Button, Pagination} from 'react-bootstrap'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

function SearchResults(){

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [flights, setFlights] = useState([])

    const [loginEvent, setLoginEvent] = useState({
        email: "",
        password: ""
    })

    const flightHandler = (arr) => setFlights(arr)
    

    useEffect(async ()=>{
        var search = window.location.search
        const response = await axios.get('http://localhost:8000/api/customer/searchForFlights'+search)
        console.log(response);
        if (response.data.status !== 'invalidempty'){
            flightHandler(response.data.flightsArr);
            console.log(response);
        } 
    }, [])

    const loginChangeHandler = (event) => {
        setLoginEvent({
            ...loginEvent, 
            [event.target.name]: event.target.value
        })
    }

    const loginButtonHandler = () => login(loginEvent, '/searchResults'+window.location.search)

    const [registerEvent, setRegisterEvent] = useState({
        email: "", name: "", password: "", building_number: "",
        street: "", city: "", state: "", passport_number: "", phone_number: "",
        passport_expiration: "", passport_country: "", date_of_birth: ""
    })

    const registerChangeHandler = (event) => {
        setRegisterEvent({
            ...registerEvent,
            [event.target.name]: event.target.value
        })
    }

    const registerButtonHandler = () => register(registerEvent, '/searchResults')
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);
    let loggedIn = false
    if (checkLoggedIn()) loggedIn = true
{/* <td>{flight.ticketID}</td>
<td>{flight.flight_number}</td>
<td>{flight.airline_name}</td>
<td>{flight.depart_date}</td>
<td>{flight.depart_time}</td>
<td>{flight.arrive_date}</td>
<td>{flight.arrive_time}</td>
<td>{flight.depart_airport_name}</td>
<td>{flight.arrive_airport_name}</td>
<td>{flight.base_price}</td> */}

    const columns = [
        { dataField: "ID", text: 'Ticket ID' },
        { dataField: "flight_number", text: 'Flight #'},
        { dataField: "airline_name", text: 'Airline Name'},
        { dataField: "depart_date", text: 'Departure Date'},
        { dataField: "depart_time", text: 'Departure Time'},
        { dataField: "arrive_date", text: 'Arrival Date'},
        { dataField: "arrive_time", text: 'Arrival Time'},
        { dataField: "depart_airport_name", text: 'Leaving From'},
        { dataField: "arrive_airport_name", text: 'Arriving To'},
        { dataField: "base_price", text: 'Base Price'},
    ]

    const rowEvents = {
        onClick: (e, row, rowIndex) => {
          if (loggedIn) window.location = '/purchase/'+row.airline_name+'/'+row.flight_number+'/'+row.depart_date+'/'+row.depart_time+'/'+row.base_price    
          else handleShow()
        }
      };

    return (
        <div>
            {loggedIn ? <NavBar 
                nav={[['/viewFlights', 'View My Flights'], ['/trackSpending', 'Track Spending'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {logout}
                logoPath='/'
            />
            :
            <NavBar 
                nav={[['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {logout}
                logoPath='/'
            />
        }
            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Email</label>
                        <br/>
                        <input type="email" name="email" placeholder="Email" onChange={loginChangeHandler} autocomplete="chrome-off" required/>
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
                        <label>Name</label>
                        <br/>
                        <input name="name" placeholder="Name" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Address Line 1: Building Number</label>
                        <br/>
                        <input name="building_number" placeholder="Building Number" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Address Line 2: Street</label>
                        <br/>
                        <input name="street" placeholder="street" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>City</label>
                        <br/>
                        <input name="city" placeholder="city" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>State</label>
                        <br/>
                        <input name="state" placeholder="state" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Phone Number</label>
                        <br/>
                        <input type="tel" name="phone_number" placeholder="Phone Number" onChange={registerChangeHandler} required/>
                        <br />
                        <br />
                        <label>Passport #</label>
                        <br/>
                        <input name="passport_number" placeholder="Passport #" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Passport Expiration</label>
                        <br/>
                        <input type="date" name="passport_expiration" placeholder="Passport Expiration" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Passport Country</label>
                        <br/>
                        <input name="passport_country" placeholder="Country of passport" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Date of Birth</label>
                        <br/>
                        <input type="date" name="date_of_birth" placeholder="Date of Birth" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Email</label>
                        <br/>
                        <input type="email" name="email" placeholder="Email" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Password</label>
                        <br/>
                        <input type="password" name="password" placeholder="Password" onChange={registerChangeHandler} required/>
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
            <h1>Click on Row to Purchase</h1>
            <BootstrapTable class="table-hover"
                keyField="name"
                data={flights}
                columns={columns}
                rowEvents={ rowEvents }
                pagination={paginationFactory()}
            />

        </div>
    )
}

export default SearchResults