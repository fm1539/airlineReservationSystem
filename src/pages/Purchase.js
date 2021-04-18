import {useParams} from 'react-router-dom'
import {React, useState} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap'
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios'

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
    type="submit"
    disabled={processing || disabled}
  >
    {processing ? "Processing..." : children}
  </button>
);

const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement onChange={onChange} />
  </div>
);

const CheckoutForm = () => {
  let {airlineName, flightNumber, departDate, departTime, basePrice} = useParams()
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)

  
    
  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    if (error) {
      cardElement.focus();
      return;
    }

    if (cardComplete) {
      console.log("Hi");
      setProcessing(true)
    }

    // Use your card Element with other Stripe.js APIs
    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });


    // if (error) {
    //   console.log('[error]', error);
    // } else {
    //   console.log('[PaymentMethod]', paymentMethod);
    // }

    if (payload.error) setError(payload.error)
    else setPaymentMethod(payload.paymentMethod)

    let obj = {
      email: JSON.parse(localStorage.getItem('custObj')).email,
      airline_name: airlineName,
      flight_number: flightNumber,
      depart_date: departDate,
      depart_time: departTime,
      base_price: basePrice
    }

    if (paymentMethod) {
      axios.post('http://localhost:8000/api/customer/purchaseTickets', obj).then(response=>{
        console.log(response);
      })
      window.location = '/viewFlights'
    }

    else alert("Payment not successful, please try again")
  
  };

  return (
    <div className="checkout">
        <section>
          <div class="product">
            <img
              src="https://i.imgur.com/EHyR2nP.png"
              alt="The cover of Stubborn Attachments"
            />
            <div class="description">
              <h3>Stubborn Attachments</h3>
              <h5>${basePrice}</h5>
              <form onSubmit={handleSubmit}>
                <CardField
                  onChange={(e) => {
                    setError(e.error);
                    setCardComplete(e.complete);
                  }}
                />
                <SubmitButton processing={processing} error={error} disabled={!stripe}>Checkout</SubmitButton>
              </form>
            </div>
          </div>
          
        </section>

    
    
  </div>
  )
};

export default CheckoutForm