import {useParams} from 'react-router-dom'
import React from 'react';
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

const CheckoutForm = () => {
  let {airlineName, flightNumber, departDate, departTime} = useParams()
  console.log(flightNumber, departDate, departTime);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    console.log(event);
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

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
    let obj = {
      airline_name: airlineName,
      flight_number: flightNumber,
      depart_date: departDate,
      depart_time: departTime
    }
    axios.post('http://localhost:8000/api/customer/purchaseTickets', obj).then(response=>{
      console.log(response.data.status);
    })

  };

  return (
    <div>
        <section>
          <div class="product">
            <img
              src="https://i.imgur.com/EHyR2nP.png"
              alt="The cover of Stubborn Attachments"
            />
            <div class="description">
              <h3>Stubborn Attachments</h3>
              <h5>$20.00</h5>
            </div>
          </div>
          
        </section>


    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" id="checkout-button" disabled={!stripe}>Checkout</button>
    </form>
    
  </div>
  )
};

export default CheckoutForm