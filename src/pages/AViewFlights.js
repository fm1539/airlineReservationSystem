import React, {useState, useEffect} from 'react'
import NavBar from '../shared/NavBar'
import axios from 'axios'
import { Table, Tab, Tabs, Modal, Button } from 'react-bootstrap';
import {aLogout} from '../global/Reducer'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

function AViewFlights(){

    const [flights, setFlights] = useState([])

    const [past, setPast] = useState([])
    const [future, setFuture] = useState([])

    const [rowInfo, setRowInfo] = useState({})

    const [review, setReview] = useState({
        rating: "",
        comments: ""
    })

    const reviewHandler = (event) => {
        setReview({
            ...review,
            [event.target.name]: event.target.value
        })
    }

    const rowInfoHandler = (info) => {
        setRowInfo(info)
    }
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    const flightsHandler = (arr) => {
        setFlights(arr)
    }
    const pastHandler = (arr) => {
        setPast(arr)
    }
    const futureHandler = (arr) => {
        setFuture(arr)
    }

    useEffect(() => {
        let pastArr = []
        let futureArr = []
        flights.forEach(flight => {
            const departDate = flight.depart_date.slice(0,flight.depart_date.indexOf('T'))
            const departYear = departDate.slice(0, departDate.indexOf('-'))
            const departMonth = departDate.slice(departDate.indexOf('-') + 1, departDate.indexOf('-') + 3)
            const departDay = departDate.slice(departDate.indexOf('-') + 4, departDate.length-1)
            if (parseInt(departYear) > today.getFullYear) {
                futureArr.push(flight)
            }
            else if(parseInt(departYear) < parseInt(today.getFullYear())) {
                pastArr.push(flight)
            }
            else{
                if (parseInt(departMonth) < parseInt(today.getMonth())) {
                    pastArr.push(flight) 
                }
                else if(parseInt(departMonth) > parseInt(today.getMonth())) {
                    futureArr.push(flight)
                }
                else{
                    if (parseInt(departDay) < parseInt(today.getDate())) {
                        pastArr.push(flight)
                    }
                    else{
                        futureArr.push(flight)
                    }
                }
            }
        });
        pastHandler(pastArr)
        futureHandler(futureArr)
    }, [flights])
    
    useEffect(() => {
        axios.get('http://localhost:8000/api/agent/' + JSON.parse(localStorage.getItem('agentObj')).email + '/viewFlights').then( response => {
            console.log(response);
            if (response.data.status == 'success'){
                flightsHandler(response.data.flightObj.results)
            }
        })
    }, []) 
    
    const columns = [
        { dataField: "ticketID", text: 'Ticket ID' },
        { dataField: "flight_number", text: 'Flight #'},
        { dataField: "airline_name", text: 'Airline Name'},
        { dataField: "depart_date", text: 'Departure Date'},
        { dataField: "depart_time", text: 'Departure Time'},
        { dataField: "arrive_date", text: 'Arrival Date'},
        { dataField: "arrive_time", text: 'Arrival Time'},
        { dataField: "depart_airport_name", text: 'Leaving From'},
        { dataField: "arrive_airport_name", text: 'Arriving To'},
        { dataField: "base_price", text: 'Base Price'}
    ]

    const reviewAction = {
        onClick: (e, row, rowIndex) => {
          console.log(row);
          //save specific row info to a state
          rowInfoHandler(row)

          //have modal pop up to add review and submit
          handleShow(true)
        }
      };
    
    const reviewBtnHandler = () => {
        const obj = {
            airline_name: rowInfo.airline_name,
            flight_number: rowInfo.flight_number,
            depart_date: rowInfo.depart_date,
            depart_time: rowInfo.depart_time,
            rating: review.rating,
            comments: review.comments
        }
        console.log(obj);
        axios.post('http://localhost:8000/api/customer/'+JSON.parse(localStorage.getItem('custObj')).email+'/giveRating', obj)
        .then(response => {
            handleClose()
        })
    }

    return (
        <div>
            <NavBar 
                nav={[['/aViewFlights', 'View My Flights'],['/trackSpending', 'Track Spending'], ['#pricing', 'Flight Tracker']]} 
                loggedIn = {true}
                logOut = {aLogout}
            />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Rating</label>
                        <br/>
                        <input name="rating" placeholder="Name" onChange={reviewHandler} required/>
                        <br/>
                        <br/>
                        <label>Comment</label>
                        <br/>
                        <input name="comments" placeholder="Comment" onChange={reviewHandler} required/>
                        <br/>
                        <br/>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={reviewBtnHandler}>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>
            <h1 style={{textAlign: 'left', marginLeft: '10%', marginTop: '2vh'}}>My Flights</h1>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="past" title="Past Flights">
                <h1>Click on Row to Review</h1>
                <BootstrapTable class="table-hover"
                        keyField="name"
                        data={past}
                        columns={columns}
                        rowEvents={ reviewAction }
                        pagination={paginationFactory()}
                    />
                </Tab>
                <Tab eventKey="future" title="Current/Future Flights">
                    <BootstrapTable class="table-hover"
                        keyField="name"
                        data={future}
                        columns={columns}
                        // rowEvents={ rowEvents }
                        pagination={paginationFactory()}
                    />

                </Tab>
            </Tabs>
            
        </div>
    )

}

export default AViewFlights



































