import React, {useState, useEffect} from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarContent, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { NavLink } from 'react-router-dom';
import {InputGroup, FormControl, Modal, Button, Card, Container, Row, Col} from 'react-bootstrap'
import {sLogin, sLogout, sCheckLoggedIn, sRegister} from '../global/Reducer'
import axios from 'axios'

function Sidebar(){

    const [flight, setFlight] = useState({
        departDate: "", departTime: "", arriveDate: "" , arriveTime: "",
        arriveAirport: "", departAirport: "", basePrice: "", status: ""
    })

    const flightChangeHandler= (event) => {
        setFlight({
            ...flight,
            [event.target.name]: event.target.value
        })
    }

    const createHandler = () => {
        const obj = {
            airline_name: JSON.parse(localStorage.getItem('staffObj')).airline_name,
            depart_date: flight.departDate,
            depart_time: flight.departTime,
            arrive_date: flight.arriveDate,
            arrive_time: flight.arriveTime,
            arrive_airport_name: flight.arriveAirport,
            depart_airport_name: flight.departAirport,
            base_price: flight.basePrice,
            status: flight.status
        }
        axios.post("http://localhost:8000/api/staff/createFlight", obj).then(response => {
            console.log(response);
            window.location = '/staff'
        })
    }

    const [airports, setAirports] = useState([])
    const [showCreate, setShowCreate] = useState(false)
    const handleCloseCreate = () => setShowCreate(false)
    const handleShowCreate = () => setShowCreate(true)

    const airportHandler = (arr) => {
        setAirports(arr)
    }
    
    useEffect(()=> {
        axios.get('http://localhost:8000/api/staff/getAllAirports').then( response => {
            console.log(response.data.results);
            let arr = []
            response.data.results.forEach(airport => {
                arr.push([airport.name, true, true])
            });
            console.log(arr)
            airportHandler(arr)
        })
        
    }, [])


    useEffect(()=> {
        console.log(flight);
        console.log(flight.arriveAirport)
        console.log(airports)
        if (flight.arriveAirport !== ""){
            console.log('here');
            let index = 0
            for (let i = 0; i < airports.length; i++){
                if (airports[i][0] === flight.arriveAirport){
                    index = i
                    break
                }
            }
            console.log(index)
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
            console.log('here');
            let index = 0
            for (let i = 0; i < airports.length; i++){
                if (airports[i][0] === flight.departAirport){
                    index = i
                    break
                }
            }
            console.log(index)
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
    
    return (
        <React.Fragment>
        <ProSidebar className="side-bar">
                <SidebarHeader>
                    Employee
                </SidebarHeader>
                <SidebarContent>
                <ProSidebar>
                <Button onClick={handleShowCreate}>Create New Flight +</Button>
                        <Modal centered show={showCreate} onHide={handleCloseCreate}>
                            <Modal.Header closeButton>
                            <Modal.Title>Create a New Flight</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <label>Depart Date</label>
                                    <br/>
                                    <input type="date" name="departDate" onChange={flightChangeHandler} required/>
                                    <br/>
                                    <br/>
                                    <label>Depart Time</label>
                                    <br/>
                                    <input type="time" name="departTime" onChange={flightChangeHandler} required/>
                                    <br/>
                                    <br/>
                                    <label>Arrive Date</label>
                                    <br/>
                                    <input type="date" name="arriveDate" onChange={flightChangeHandler} required/>
                                    <br/>
                                    <br/>
                                    <label>Arrive Time</label>
                                    <br/>
                                    <input type="time" name="arriveTime" onChange={flightChangeHandler} required/>
                                    <br/>
                                    <br/>
                                    <label>Depart From</label>
                                    <br/>
                                    <select id="depAirport" name="departAirport" onChange={flightChangeHandler}>
                                        <option></option>
                                        {airports.map((airport)=>{
                                            return (
                                                 airport[1]?
                                                <option value={airport[0]}>{airport[0]}</option>: null
                                            )
                                        })}
                                        </select>
                                    <br />
                                    <br />
                                    <label> Arrive To </label>
                                    <br/>
                                    <select id="arrAirport" name="arriveAirport" onChange={flightChangeHandler}>
                                        <option></option>
                                        {airports.map((airport)=>{
                                            return (
                                                airport[2]?
                                                <option value={airport[0]}>{airport[0]}</option> : null
                                            )
                                        })}
                                        </select>
                                    <br/>
                                    <br/>
                                    <label> Base Price </label>
                                    <br/>
                                    <input type="text" name="basePrice" placeholder="Base Price" onChange={flightChangeHandler} autocomplete="chrome-off" required/>
                                    <br/>
                                    <br/>
                                    <label> Status </label>
                                    <br/>
                                    <input type="text" name="status" placeholder="Status" onChange={flightChangeHandler} autocomplete="chrome-off" required/>
                                    <br/>
                                    <br/>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreate}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={createHandler}>
                                Create
                            </Button>
                            </Modal.Footer>
                        </Modal>
                <Menu iconShape="square">
                    <SubMenu title="View Flights" >
                    <MenuItem>
                        <NavLink to="/staff"  activeStyle={{ color: 'red'}}>
                            Next 30 days
                        </NavLink>
                    </MenuItem>
                    <MenuItem>
                        <NavLink to="/range"  activeStyle={{ color: 'red'}}>
                            Current/Past Flights
                        </NavLink>
                    </MenuItem>
                    </SubMenu>
                    <SubMenu title="Components" >
                    <MenuItem>Component 1</MenuItem>
                    <MenuItem>Component 2</MenuItem>
                    </SubMenu>
                </Menu>
            </ProSidebar>
                </SidebarContent>
                <SidebarFooter>
                    Copyright
                </SidebarFooter>
            </ProSidebar>            
            </React.Fragment>
    )
}

export default Sidebar