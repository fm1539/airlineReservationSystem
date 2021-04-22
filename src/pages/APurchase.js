import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useParams} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap'
import {loadStripe} from '@stripe/stripe-js';
import StripeCheckout from 'react-stripe-checkout'
import {
  locCardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import "react-toastify/dist/ReactToastify.css";

toast.configure();

var ACheckoutForm = () => {
  let {airlineName, flightNumber, departDate, departTime, basePrice} = useParams()

  let obj = {
      agent_email: JSON.parse(localStorage.getItem('agentObj')).email,
      airline_name: airlineName,
      flight_number: flightNumber,
      depart_date: departDate,
      depart_time: departTime,
      base_price: basePrice,
  }

  var handleToken = async (token, addresses) => {
    await axios.post('http://localhost:8000/api/agent/purchaseTickets', { obj, token }).then(response=>{
        console.log(response);
        if (response.data.status === "agentEmail was provided"){
          alert("Agent email was Provided. Please enter the customer email.")
        }
        else if (response.data.status === "no email"){
          alert("Email does not exist.")
        }
    })
    // const { status } = response.data;
    // console.log("Response:", response.data);
    // if (status === "success") {
    //   toast("Success! Check email for details", { type: "success" });
    // } else {
    //   toast("Something went wrong", { type: "error" });
    // }
  }

  return (
    <div className="checkout">
             <section>
             <div class="product">
               <img
               className="product-img"
                  src="https://i.imgur.com/EHyR2nP.png"
                  alt="The cover of Stubborn Attachments"
                />
               <div class="description">
                <h3>TIcket</h3>
                <h5>${basePrice}</h5>
                <StripeCheckout
                  stripeKey="pk_test_51IPVGeE1OhnzAuXAmvR1DDLZqKBvBjGxwZVGO7y8Z7PGGiJdXsScgnYFfVrEgTjSiUQZAFsrKCAlOIylnkNuGyjA009HBZEEJF"
                  token={handleToken}
                  amount={basePrice * 100}
                  name="Airline Ticket"
                  billingAddress
                  shippingAddress
                />
              </div>
            </div>
            </section>
    </div>
  );
}

export default ACheckoutForm