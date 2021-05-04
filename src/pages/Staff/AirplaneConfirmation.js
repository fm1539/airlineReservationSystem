import React, {useState, useEffect} from 'react';
import 'react-pro-sidebar/dist/css/styles.css';
import {Button} from 'react-bootstrap'
import axios from 'axios'

function AirplaneConfirmation() {

    const [airplanes, setAirplanes] = useState([])

    const airplaneHandler = (arr) => setAirplanes(arr)

    const returnBtnHandler = () => window.location = '/staff'
    
    useEffect(() => axios.get('http://localhost:8000/api/staff/getAllAirplanes/'+JSON.parse(localStorage.getItem('staffObj')).airline_name)
    .then(response => airplaneHandler(response.data.ownedAirplanes)), [])

    return (
        <React.Fragment>
            <h1> All Current Airplanes </h1>
            {airplanes.map((airplane)=>{
                return (
                    <p>{airplane.ID}</p>
                )
            })}
            
            <Button onClick={returnBtnHandler}>Return</Button>

        </React.Fragment>
    )
}

export default AirplaneConfirmation

