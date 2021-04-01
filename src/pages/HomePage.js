import React, {useState} from 'react'
import NavBar from '../shared/NavBar'
import {InputGroup, FormControl, Modal, Button} from 'react-bootstrap'

function HomePage(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Woohoo, you're reading this text in a modal!
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Sign In
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Woohoo, you're reading this text in a modal!
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose2}>
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