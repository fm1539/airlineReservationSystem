import React, {useState} from 'react'
import NavBar from '../shared/NavBar'
import axios from 'axios'
import {InputGroup, FormControl, Modal, Button} from 'react-bootstrap'

function HomePage(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const [login, setLogin] = useState(true)

    const [loginEvent, setLoginEvent] = useState({
        email: "",
        password: ""
    })

    const loginChangeHandler = (event) => {
        setLoginEvent({
            ...loginEvent, 
            [event.target.name]: event.target.value
        })
    }

    const loginButtonHandler = () => {
        console.log(loginEvent)
        axios.post('http://localhost:8000/api/customer/login', loginEvent).then( response => {
            console.log(response.data);
            if (response.data.status === "logged"){
                console.log(response.data.userObj);
                localStorage.setItem('userObj', JSON.stringify(response.data.userObj))
                window.location = '/messages'
            }
            else{
                alert('Username or password is incorrect. Please try again')
            }
        }
        )
    }

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

    const registerButtonHandler = () => {
        console.log(registerEvent)
        axios.post('http://localhost:8000/api/customer/register', registerEvent).then( response => {
            if (response.data.status === "registered") window.location = '/'
            else alert('Username or Email already exists')
        }
    )}

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    return (
        <React.Fragment>
            <NavBar 
                nav={[['/', 'Features'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
            />
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
            <div className="search-flights-div">
                <h1>Search Flights</h1>
                <div style={{'display': 'flex'}}>
                    <InputGroup className="mb-3" style={{'width': '50%'}}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Leaving</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="From"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    <div style={{'width': '10px'}}> </div>
                    <InputGroup className="mb-3" style={{'width': '50%'}}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Going</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="To"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </div>
                <label>Departure Date: </label>
                <input type="date"/>
            </div>
        </React.Fragment>
    )
}

export default HomePage