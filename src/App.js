import Button from 'react-bootstrap/Button';
import {BrowserRouter as Router} from 'react-router-dom'
import {Route, Switch, Redirect} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults';
import ViewFlights from './pages/ViewFlights'


<Route path="/" exact>
          {JSON.parse(localStorage.getItem('userObj')) ?
          <Redirect to="/messages" /> :
          <HomePage />
          } 
        </Route>

function App() {
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
          <Route path='/searchResults'>
            <SearchResults />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
