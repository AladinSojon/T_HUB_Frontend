import React from 'react';

import Header from './components/Header';
import './App.css'
import ListItem from './components/ListItem';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ItemComponent from './components/ItemComponent';
import UserComponent from './components/UserComponent';
import ListUser from './components/ListUser';
import Login from './components/Login';
import Signup from './components/Signup';
import MenuComponent from './components/MenuComponent';
import ListMenu from './components/ListMenu';

function App() {

  return (
      <Router>
        <Header />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route path="/item-list" component={ListItem} />
            <Route path="/item/:id" component={ItemComponent} />
            <Route path="/user-list" component={ListUser} />
            <Route path="/menu-list" component={ListMenu} />
            <Route path="/user/:id" component={UserComponent} />
            <Route path="/menu/:id" component={MenuComponent} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
        {/* <Footer /> */}
      </Router>
  );
}

export default App;
