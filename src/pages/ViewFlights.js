import React, {useState, useEffect} from 'react'
import NavBar from '../shared/NavBar'
import axios from 'axios'
import { Table, Tab, Tabs } from 'react-bootstrap';
import {logout} from '../global/Reducer'


function ViewFlights(){

    const [flights, setFlights] = useState([])

    
    
    const flightsHandler = (arr) => {
        setFlights(arr)
    }
    
    useEffect(() => {
        axios.get('http://localhost:8000/api/customer/' + JSON.parse(localStorage.getItem('custObj')).email + '/viewFlights').then( response => {
            console.log(response.data);
            if (response.data.status == 'success'){
                flightsHandler(response.data.futureFlightObj.results)
            }
        })
    }, [])

    return (
        <div>
            <NavBar 
                nav={[['/viewFlights', 'View My Flights'], ['#pricing', 'Flight Tracker']]} 
                loggedIn = {true}
                logOut = {logout}
            />
            <h1 style={{textAlign: 'left', marginLeft: '10%', marginTop: '2vh'}}>My Flights</h1>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="past" title="Past Flights">
                {/* <Table striped bordered hover style={{width: '60vh', marginLeft: 'auto', marginRight: 'auto', marginTop: '10vh'}}> */}
                <table>
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Flight #</th>
                        <th>Airline</th>
                        <th>Departure Date</th>
                        <th>Departure Time</th>
                        <th>Arrival Date</th>
                        <th>Arrival Time</th>
                        <th>Leaving From</th>
                        <th>Arrving To</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        flights.map((flight)=>{
                            return (
                                <React.Fragment>
                                    <td>{flight.ticketID}</td>
                                    <td>{flight.flight_number}</td>
                                    <td>{flight.airline_name}</td>
                                    <td>{flight.depart_date}</td>
                                    <td>{flight.depart_time}</td>
                                    <td>{flight.arrive_date}</td>
                                    <td>{flight.arrive_time}</td>
                                    <td>{flight.depart_airport_name}</td>
                                    <td>{flight.arrive_airport_name}</td>
                                    <td>{flight.base_price}</td>
                                </React.Fragment>
                            )
                        })
                    }
                </tbody>
                </table>
            {/* </Table> */}
                </Tab>
                <Tab eventKey="future" title="Current/Future Flights">
                {/* <Table striped bordered hover style={{width: '60vh', marginLeft: 'auto', marginRight: 'auto', marginTop: '10vh'}}> */}
                <table>
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Flight #</th>
                        <th>Airline</th>
                        <th>Departure Date</th>
                        <th>Departure Time</th>
                        <th>Arrival Date</th>
                        <th>Arrival Time</th>
                        <th>Leaving From</th>
                        <th>Arrving To</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        flights.map((flight)=>{
                            return (
                                <div>
                                    {/* <React.Fragment> */}
                                        <td>{flight.ticketID}</td>
                                        <td>{flight.flight_number}</td>
                                        <td>{flight.airline_name}</td>
                                        <td>{flight.depart_date}</td>
                                        <td>{flight.depart_time}</td>
                                        <td>{flight.arrive_date}</td>
                                        <td>{flight.arrive_time}</td>
                                        <td>{flight.depart_airport_name}</td>
                                        <td>{flight.arrive_airport_name}</td>
                                        <td>{flight.base_price}</td>
                                    {/* </React.Fragment> */}
                                </div>
                            )
                        })
                    }
                </tbody>
            {/* </Table> */}
            </table>

                </Tab>
            </Tabs>
            
        </div>
    )

}

export default ViewFlights



































