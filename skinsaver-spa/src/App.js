import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import LinkerTable from './LinkerTable';
import {Route, BrowserRouter} from 'react-router-dom';


function App() {
  return (
      <BrowserRouter>
          <Route path={'*'}>
              <LinkerTable/>
          </Route>
      </BrowserRouter>
  );
}

export default App;
