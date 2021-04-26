import Button from 'react-bootstrap/Button';
import {BrowserRouter as Router} from 'react-router-dom'
import {Route, Switch, Redirect} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults';
import ASearchResults from './pages/ASearchResults';
import ViewFlights from './pages/ViewFlights'
import AViewFlights from './pages/AViewFlights'
import CheckoutForm from './pages/Purchase'
import ACheckoutForm from './pages/APurchase'
import React from 'react';
import ReactDOM from 'react-dom';
import TrackSpender from './pages/TrackSpending'
impoHomePage from './pages/AHomePage'
import SHomePage from './pages/SHomePage'
import ViewTopCustomer from './pages/ViewTopCustomer'
import About from './pages/About'
import AirplaneConfirmation from './pages/AirplaneConfirmation'
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Commision from './pages/Commision'
import RangeFlights from './pages/RangeFlights';

<Route path="/" exact>
          {JSON.parse(localStorage.getItem('userObj')) ?
          <Redirect to="/messages" /> :
          <HomePage />
          } 
        </Route>

function App() {
  const stripePromise = loadStripe("pk_test_51IPVGeE1OhnzAuXAmvR1DDLZqKBvBjGxwZVGO7y8Z7PGGiJdXsScgnYFfVrEgTjSiUQZAFsrKCAlOIylnkNuGyjA009HBZEEJF")
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Route path='/viewFlights' exact>
            {JSON.parse(localStorage.getItem('custObj')) ?
            <ViewFlights /> :
            <Redirect to="/" />
            }
          </Route>
          <Route path='/aViewFlights' exact>
            {JSON.parse(localStorage.getItem('agentObj')) ?
            <AViewFlights /> :
            <Redirect to="/" />
          }
          </Route>
          <Route path='/purchase/:airlineName/:flightNumber/:departDate/:departTime/:basePrice' exact>
          {JSON.parse(localStorage.getItem('custObj')) ?
            <Elements stripe={stripePromise}><CheckoutForm /></Elements> :
            <Redirect to="/" />
          }
          </Route>
          <Route path='/aPurchase/:airlineName/:flightNumber/:departDate/:departTime/:basePrice' exact>
          {JSON.parse(localStorage.getItem('agentObj')) ?
            <Elements stripe={stripePromise}><ACheckoutForm /></Elements> :
            <Redirect to="/" />
          } 
          </Route>
          <Route path='/searchResults' exact>
            <SearchResults />
          </Route>
          <Route path='/trackSpending' exact>
            {JSON.parse(localStorage.getItem('custObj')) ?
            <TrackSpender /> :
            <Redirect to="/" />
            }
          </Route>
          <Route path='/agent' exact>
            <AHomePage />
          </Route>
          <Route path='/aSearchResults' exact>
            <ASearchResults />
          </Route>
          <Route path='/commission' exact>
          {JSON.parse(localStorage.getItem('agentObj')) ?
            <Commision /> :
            <Redirect to="/agent" />
            }
          </Route>
          <Route path='/viewTop' exact>
            {JSON.parse(localStorage.getItem('agentObj')) ? 
            <ViewTopCustomer />:
            <Redirect to="/agent" />  
          }
          </Route>
          <Route path='/about' exact>
            <About />
          </Route>
          <Route path='/staff' exact>
            <SHomePage />
          </Route>
          <Route path='/range' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ? 
              <RangeFlights />:
              <Redirect to="/staff" />  
            }
          </Route>
          <Route path='/confirmation' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ? 
            <AirplaneConfirmation />:
            <Redirect to="/staff" />
            }
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
