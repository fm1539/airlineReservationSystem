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

var CheckoutForm = () => {
  let {airlineName, flightNumber, departDate, departTime, basePrice} = useParams()

  let obj = {
      email: JSON.parse(localStorage.getItem('custObj')).email,
      airline_name: airlineName,
      flight_number: flightNumber,
      depart_date: departDate,
      depart_time: departTime,
      base_price: basePrice,
  }

  var handleToken = async (token, addresses) => {
    await axios.post('http://localhost:8000/api/customer/purchaseTickets', { obj, token }).then(response=>console.log(response))
    // const { status } = response.data;
    // console.log("Response:", response.data);
    // if (status === "success") {
    //   toast("Success! Check email for details", { type: "success" });
    // } else {
    //   toast("Something went wrong", { type: "error" });
    // }
    window.location = '/viewFlights'
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

export default CheckoutForm