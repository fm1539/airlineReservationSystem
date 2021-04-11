import './App.css';
import Button from 'react-bootstrap/Button';
import {BrowserRouter as Router} from 'react-router-dom'
import {Route, Switch, Redirect} from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
