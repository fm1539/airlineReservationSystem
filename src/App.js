import './App.css';
import Button from 'react-bootstrap/Button';
import {BrowserRouter as Router} from 'react-router-dom'
import {Route, Switch, Redirect} from 'react-router-dom'
import HomePage from './pages/HomePage'
import Store from './global/Store'

function App() {
  return (
    <Store>
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
    </Store>
  );
}

export default App;
