import { React, useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../shared/Sidebar'
import NavBar from '../shared/NavBar'
import {sLogin, sLogout, sCheckLoggedIn, sRegister} from '../global/Reducer'
import {InputGroup, FormControl, Modal, Button, Card, Container, Row, Col, Tab, Tabs} from 'react-bootstrap'
import paginationFactory from 'react-bootstrap-table2-paginator'
import BootstrapTable from 'react-bootstrap-table-next'

function SAgent(){

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [view, setView] = useState("")

    const [topTicketsObj, setTopTicketsObj] = useState([])
    const [topCommissionsObj, setTopCommissionsObj] = useState([])

    const viewChangeHandler = (event) => {
        if (event.target.value === "Past Month") setView("month")
        else setView("year")
    }

    const setTopTicketsObjHandler = (arr) => {
        setTopTicketsObj(arr)
    }

    const setTopCommissionsObjHandler = (arr) => {
        setTopCommissionsObj(arr)
    }

    useEffect(() => {
        let obj = {
            timeFlag: view,
            airline_name: JSON.parse(localStorage.getItem('staffObj')).airline_name
        }
        axios.post("http://localhost:8000/api/staff/topAgents", obj).then(response => {
            console.log(response);
            setTopTicketsObjHandler(response.data.topAgentByTicketsSold);
            setTopCommissionsObjHandler(response.data.topAgentByCommission);
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
            <h1>By Number of Ticket Sales</h1>
            <br />
            <br />
            <select id="view" name="view" onChange={viewChangeHandler}>
                <option></option>
                <option>Past Month</option>
                <option>Past Year</option>
            </select>
                           
            {view == "month" ? 
            <div>
                <table style={{width: '100%'}}>
                    <caption>Monthly savings</caption>
                    <tr>
                        <th>Agent Email</th>
                        <th>Tickets Sold</th>
                    </tr>
                    {topTicketsObj.map((agent) => {
                        return (
                            <tr>
                                <td> {agent.agent_email} </td>
                                <td> {agent.ticketsSold} </td>
                            </tr>
                        )
                    })}
                        {/* <td>January</td>
                        <td>$100</td> */}
                    
                </table>
            </div> : view == "year" ?
            <div>
                <table style={{width: '100%'}}>
                    <caption>Monthly savings</caption>
                    <tr>
                        <th>Agent Email</th>
                        <th>Tickets Sold</th>
                    </tr>
                    {topTicketsObj.map((agent) => {
                        return (
                            <tr>
                                <td> {agent.agent_email} </td>
                                <td> {agent.ticketsSold} </td>
                            </tr>
                        )
                    })}
                </table>
            </div> : null }
            <hr />
            <h1>Commission</h1>
            <br />
            <br />
            <table style={{width: '100%'}}>
                <caption>Monthly savings</caption>
                <tr>
                    <th>Agent Email</th>
                    <th>Commissioned</th>
                </tr>
                {topCommissionsObj.map((agent) => {
                        return (
                            <tr>
                                <td> {agent.agent_email} </td>
                                <td> {agent.commissioned} </td>
                            </tr>
                        )
                    })}

            </table>
        </div>
    )
}
export default SAgent