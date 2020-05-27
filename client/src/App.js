import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import Other from './OtherPage'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <Link to="/">Home</Link><br />
          <Link to="/otherpage">Other Page</Link>
        </header>
      </div>
      <Route exact path="/" component={Fib} />
      <Route path="/otherpage" component={Other} />
    </BrowserRouter>
  );
}

export default App;
