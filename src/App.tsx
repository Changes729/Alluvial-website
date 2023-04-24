import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <form action="http://localhost:8080/upload" method="post" encType="multipart/form-data">
        <p />File Name: <input type="text" name="FileName" placeholder="file name" />
        <p /><input type="file" name="FileName" />
        <p /><button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
