import React, {useEffect, useState} from 'react'
import NavBar from '../shared/NavBar'
import axios from 'axios'
import {aLogin, aLogout, aCheckLoggedIn, aRegister} from '../global/Reducer'
import {Modal, Button, Pagination} from 'react-bootstrap'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

function ASearchResults(){

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [flights, setFlights] = useState([])

    const [loginEvent, setLoginEvent] = useState({
        email: "",
        password: ""
    })

    const flightHandler = (arr) => {
        setFlights(arr)
        console.log(flights);
    }

    useEffect(async ()=>{
        var search = window.location.search
        // console.log(JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'))
        console.log(search);
        const response = await axios.get('http://localhost:8000/api/agent/searchForFlights'+search)
        console.log(response);
        if (response.data.status !== 'invalidempty') flightHandler(response.data.flightsArr);
    }, [])

    const loginChangeHandler = (event) => {
        setLoginEvent({
            ...loginEvent, 
            [event.target.name]: event.target.value
        })
    }

    const loginButtonHandler = () => {
        console.log(loginEvent)
        aLogin(loginEvent, '/aSearchResults'+window.location.search)
    }

    const [registerEvent, setRegisterEvent] = useState({
        email: "",
        password: ""
    })

    const registerChangeHandler = (event) => {
        setRegisterEvent({
            ...registerEvent,
            [event.target.name]: event.target.value
        })
    }

    const registerButtonHandler = () => {
        aRegister(registerEvent, '/aSearchResults')
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    let loggedIn = false
    if (aCheckLoggedIn()){
        loggedIn = true
    }
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
    ]

    const rowEvents = {
        onClick: (e, row, rowIndex) => {
          console.log(row);
          if (loggedIn) window.location = '/aPurchase/'+row.airline_name+'/'+row.flight_number+'/'+row.depart_date+'/'+row.depart_time+'/'+row.base_price    
          else handleShow()
        }
      };

    return (
        <div>
            {loggedIn ? <NavBar 
                nav={[['/aViewFlights', 'View My Flights'], ['/viewTop', 'View Top Customers'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {aLogout}
                logoPath='/agent'
            />
            :
            <NavBar 
                nav={[['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {aLogout}
                logoPath="/agent"
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

export default ASearchResults