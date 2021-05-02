import React, { useState, useEffect } from 'react'
import NavBar from '../shared/NavBar'
import Chart from "react-google-charts"
import Sidebar from '../shared/Sidebar'
import {sLogout, sCheckLoggedIn} from '../global/Reducer'
import { Table, Tab, Tabs, Modal, Button, Row, Nav, Col } from 'react-bootstrap';
import axios from 'axios'

function TopDestinations() {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [view, setView] = useState("")

    const [topDestinationsObj, setTopDestinationsObj] = useState([])

    const viewChangeHandler = (event) => {
        if (event.target.value === "Past 3 Months") setView("month")
        else setView("year")
    }

    const setTopDestinationsObjHandler = (arr) => setTopDestinationsObj(arr)

    useEffect(() => {
        let obj = {
            timeFlag: view,
            airline_name: JSON.parse(localStorage.getItem('staffObj')).airline_name
        }
        axios.post("http://localhost:8000/api/staff/topDestinations", obj).then(response => {
            setTopDestinationsObjHandler(response.data.resultsObj.results)
        })
    }, [view])

    let loggedIn = false
    if (sCheckLoggedIn()) loggedIn = true

    return (  
        <div>
            {loggedIn?
            <div>
                <Sidebar />
            </div>
            :
            <div style={{marginLeft: '270px'}}>
                <h1 style={{textAlign: 'left'}}>Please Log In</h1>
            </div>
        }
            <h1>Top Destinations</h1>
            <br />
            <br />
            <select id="view" name="view" onChange={viewChangeHandler}>
                <option></option>
                <option>Past 3 Months</option>
                <option>Past Year</option>
            </select>
                           
            {view == "month" ? 
            <div>
                <table style={{width: '100%'}}>
                    <caption>Top Destinations</caption>
                    <tr>
                        <th>City Name</th>
                        <th>Airport Name</th>
                    </tr>
                    {topDestinationsObj.map((destination) => {
                        return (
                            <tr>
                                <td> {destination.arrive_city} </td>
                                <td> {destination.arrive_airport_name} </td>
                            </tr>
                        )
                    })}
                        {/* <td>January</td>
                        <td>$100</td> */}
                    
                </table>
            </div> : view == "year" ?
            <div>
                <table style={{width: '100%'}}>
                    <caption>Top Destinations</caption>
                    <tr>
                        <th>City Name</th>
                        <th>Airport Name</th>
                    </tr>
                    {topDestinationsObj.map((destination) => {
                        return (
                            <tr>
                                <td> {destination.arrive_city} </td>
                                <td> {destination.arrive_airport_name} </td>
                            </tr>
                        )
                    })}
                </table>
            </div> : null }
        </div>
    )
}

export default TopDestinations

