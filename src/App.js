import {BrowserRouter as Router} from 'react-router-dom'
import {Route, Switch, Redirect} from 'react-router-dom'
import HomePage from './pages/Customer/HomePage'
import SearchResults from './pages/Customer/SearchResults';
import ASearchResults from './pages/Agent/ASearchResults';
import ViewFlights from './pages/Customer/ViewFlights'
import AViewFlights from './pages/Agent/AViewFlights'
import CheckoutForm from './pages/Customer/Purchase'
import ACheckoutForm from './pages/Agent/APurchase'
import React from 'react';
import TrackSpender from './pages/Customer/TrackSpending'
import AHomePage from './pages/Agent/AHomePage'
import SHomePage from './pages/Staff/SHomePage'
import ViewTopCustomer from './pages/Agent/ViewTopCustomer'
import About from './pages/About'
import AirplaneConfirmation from './pages/Staff/AirplaneConfirmation'
import SAgent from './pages/Staff/SAgent'
import Frequent from './pages/Staff/Frequent/Frequent'
import LastYear1 from './pages/Staff/Reports/LastYear1'
import LastMonth from './pages/Staff/Reports/LastMonth'
import RangedReports from './pages/Staff/Reports/RangedReports'
import Comparison from './pages/Staff/Comparison'
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import Commision from './pages/Agent/Commision'
import RangeFlights from './pages/Staff/RangeFlights';
import TopDestinations from './pages/Staff/TopDestinations'

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
          <Route path='/sAgent' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ? 
              <SAgent /> :
              <Redirect to="/staff" />
            }
          </Route>
          <Route path='/frequent' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ? 
              <Frequent /> :
              <Redirect to="/staff" />
            }
          </Route>
          <Route path='/reportsLastYear' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ? 
              <LastYear1 /> :
              <Redirect to="/staff" />
            }
          </Route>
          <Route path='/reportsLastMonth' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ? 
              <LastMonth /> :
              <Redirect to="/staff" />
            }
          </Route>
          <Route path='/reportsRange' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ? 
              <RangedReports /> :
              <Redirect to="/staff" />
            }
          </Route>
          <Route path='/comparison' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ?
              <Comparison /> :
              <Redirect to="/staff" />
            }
          </Route>
          <Route path='/topDestinations' exact>
            {JSON.parse(localStorage.getItem('staffObj')) ?
              <TopDestinations /> :
              <Redirect to="/staff" />
            }
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
