// import {useParams} from 'react-router-dom'
// import {React, useState} from 'react';
// import ReactDOM from 'react-dom';
// import {Button} from 'react-bootstrap'
// import {loadStripe} from '@stripe/stripe-js';
// import StripeCheckout from 'react-stripe-checkout'
// import {
//   CardElement,
//   Elements,
//   useStripe,
//   useElements,
// } from '@stripe/react-stripe-js';
// import axios from 'axios'

// const SubmitButton = ({ processing, error, children, disabled }) => (
//   <button
//     className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
//     type="submit"
//     disabled={processing || disabled}
//   >
//     {processing ? "Processing..." : children}
//   </button>
// );

// const CardField = ({ onChange }) => (
//   <div className="FormRow">
//     <CardElement onChange={onChange} />
//   </div>
// );


// const CheckoutForm = () => {
//   let {airlineName, flightNumber, departDate, departTime, basePrice} = useParams()
//   const stripe = useStripe();
//   const elements = useElements();
//   // const [error, setError] = useState(null)
//   // const [cardComplete, setCardComplete] = useState(false)
//   // const [processing, setProcessing] = useState(false)
//   // const [paymentMethod, setPaymentMethod] = useState(null)

  
    
//   const handleSubmit = async (event) => {
//     // Block native form submission.
//     event.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js has not loaded yet. Make sure to disable
//       // form submission until Stripe.js has loaded.
//       return;
//     }

//     // Get a reference to a mounted CardElement. Elements knows how
//     // to find your CardElement because there can only ever be one of
//     // each type of element.
//     const cardElement = elements.getElement(CardElement);

//     if (error) {
//       cardElement.focus();
//       return;
//     }

//     if (cardComplete) {
//       console.log("Hi");
//       setProcessing(true)
//     }

//     // Use your card Element with other Stripe.js APIs
//     const payload = await stripe.createPaymentMethod({
//       type: 'card',
//       card: cardElement,
//     });


//     // if (error) {
//     //   console.log('[error]', error);
//     // } else {
//     //   console.log('[PaymentMethod]', paymentMethod);
//     // }

//     if (payload.error) {
//       console.log(payload);
//       setError(payload.error)
//     }
//     else setPaymentMethod(payload.paymentMethod)
//     console.log("ERROR", error);
//     console.log("PAYMENT METHOD:", paymentMethod);

//     let obj = {
//       email: JSON.parse(localStorage.getItem('custObj')).email,
//       airline_name: airlineName,
//       flight_number: flightNumber,
//       depart_date: departDate,
//       depart_time: departTime,
//       base_price: basePrice,
//     }

//     var handleToken = (token, addresses) => {
//       const response = await axios.post(
//         'http://localhost:8000/api/customer/purchaseTickets', { obj, token }
//       );
//       const { status } = response.data;
//       console.log("Response:", response.data);
//       if (status === "success") {
//         toast("Success! Check email for details", { type: "success" });
//       } else {
//         toast("Something went wrong", { type: "error" });
//       }
//     }

//     if (paymentMethod) {
//       axios.post('http://localhost:8000/api/customer/purchaseTickets', obj).then(response=>{
//         console.log(response);
//       })
//       window.location = '/viewFlights'
//     }

//     else {
//       alert("Payment not successful, please try again")
//       setProcessing(false)
//     }
  
//   };

//   return (
//     <div className="checkout">
//         <section>
//           <div class="product">
//             <img
//               src="https://i.imgur.com/EHyR2nP.png"
//               alt="The cover of Stubborn Attachments"
//             />
//             <div class="description">
//               <h3>Stubborn Attachments</h3>
//               <h5>${basePrice}</h5>
//               <form onSubmit={handleSubmit}>
//               <StripeCheckout
//                 stripeKey="pk_test_51IPVGeE1OhnzAuXAmvR1DDLZqKBvBjGxwZVGO7y8Z7PGGiJdXsScgnYFfVrEgTjSiUQZAFsrKCAlOIylnkNuGyjA009HBZEEJF"
//                 token={handleToken}
//                 amount={obj.base_price}
//                 name="Ticket"
//                 billingAddress
//                 shippingAddress
//               />
//                 <SubmitButton processing={processing} error={error} disabled={!stripe}>Checkout</SubmitButton>
//               </form>
//             </div>
//           </div>
          
//         </section>

    
    
//   </div>
//   )
// };

// export default CheckoutForm

import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useParams} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap'
import {loadStripe} from '@stripe/stripe-js';
import StripeCheckout from 'react-stripe-checkout'
import {
  CardElement,
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
    await axios.post('http://localhost:8000/api/customer/purchaseTickets', { obj, token }).then(response=>{
        console.log(response);
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
               {/* <form onSubmit={handleSubmit}>
//               <StripeCheckout
//                 stripeKey="pk_test_51IPVGeE1OhnzAuXAmvR1DDLZqKBvBjGxwZVGO7y8Z7PGGiJdXsScgnYFfVrEgTjSiUQZAFsrKCAlOIylnkNuGyjA009HBZEEJF"
//                 token={handleToken}
//                 amount={obj.base_price}
//                 name="Ticket"
//                 billingAddress
//                 shippingAddress
//               />
//                 <SubmitButton processing={processing} error={error} disabled={!stripe}>Checkout</SubmitButton>
//               </form>
//             </div> */}
              </div>
            </div>
            </section>
    </div>

    // <div className="container">
    //   <div className="product">
    //     <h3>On Sale · ${product.price}</h3>
    //   </div>
    //   <StripeCheckout
    //     stripeKey="pk_test_4TbuO6qAW2XPuce1Q6ywrGP200NrDZ2233"
    //     token={handleToken}
    //     amount={product.price * 100}
    //     name="Tesla Roadster"
    //     billingAddress
    //     shippingAddress
    //   />
    // </div>
  );
}

export default CheckoutForm