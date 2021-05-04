import React, {useState} from 'react'

function Flight(props){
    const [plusClicked, setPlusClicked] = useState(false)
    const plusHandler = () => {
        console.log('props', props);
        setPlusClicked(prev => !prev)
    }
    let icon = "plus"

    if (plusClicked){
        icon = "minus"
    }
    return (
        <div>
            <div className="flight-div"> 
                
                <div className="flight-info">
                    <h4>Flight #: {props.flight_number}</h4>
                    
                    {plusClicked ? props.customers.map((customer, index) => {
                        return (
                            <div>
                                <h6>{customer.customer_email}</h6>
                            </div>
                        )
                    }) : null }
                    
                    <br />
                    <button className="plus" onClick={plusHandler}><i class={"fa fa-"+icon} style={{fontSize:'48px', color: 'gray'}}></i></button>
                </div>
                
            </div>
        <hr/>
        
        </div>
    )
}

export default Flight