import React from 'react';
import './App.css';
import PDFLoader from './components/PDFLoader/PDFLoader';

function App() {
  return (
    <div className="App">
      <link href="//mozilla.github.io/pdf.js/web/viewer.css" rel="stylesheet" type="text/css" />
        <PDFLoader />
    </div>
  );
}

export default App;
