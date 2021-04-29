import React from 'react'

function Flight(props){
    const [plusClicked, setPlusClicked] = useState(false)
    const plusHandler = () => {
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
                    <h1>Flight Number: {props.flight_number}</h1>
                    
                    {plusClicked ? props.customers.map((customer, index) => {
                        return ()
                    }) : null }
                    
                    <br />
                </div>
                <button className="plus" onClick={plusHandler}><i class={"fa fa-"+icon} style={{fontSize:'48px', color: 'gray'}}></i></button>
            </div>
        <hr/>
        
        </div>
    )
}

export default Flight