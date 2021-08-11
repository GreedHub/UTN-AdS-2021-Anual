import React from 'react';
import './App.css';
import Login from './components/login';
import PrivateRoute from './helperComponents/privateRoute';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { history } from './helpers';
import Home from './components/home';

function App() {
  return (
    <div className="App">
       <Router history={history}>
          <Switch>
            <PrivateRoute exact path="/" authenticationPath="/login" component={Home} />
            <Route path="/login" component={Login} />
            <Redirect from="*" to="/" />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
