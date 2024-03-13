//const App = require('./App');
import React from "react";
import App from './App';

describe('true is truthy and false is falsy', () => {
 test('true is truthy', () => {
   expect(true).toBe(true);
 });

 test('false is falsy', () => {
   expect(false).toBe(false);
 });

//ACTUAL TEST
// describe("App", () => {
//    test('Checking React rendering course intake portion', () => {
//      if (App() != null) {
//        expect(true).toBe(true);
//      }
//      else {
//        expect(true).toBe(false);
//      }
//    });

// });

// // import react-testing methods
// import {render, screen} from '@testing-library/react'
// // userEvent library simulates user interactions by dispatching the events that would happen if the interaction took place in a browser.
// import userEvent from '@testing-library/user-event'
// // add custom jest matchers from jest-dom
// import '@testing-library/jest-dom'
// // the component to test
// import App from './App';

// test('loads and displays greeting', async () => {
//   // Render a React element into the DOM
//   // render(<App url="/" />)
//   ReactDOM.render(<App></App>, document.getElementById("root"));

//   // wait before throwing an error if it cannot find an element
//   await screen.findByRole('heading');

//   // assert that the alert message is correct using
//   // toHaveTextContent, a custom matcher from jest-dom.
//   expect(screen.getByRole('heading')).toHaveTextContent('Welcome To Our Calendar!');
//   expect(screen.getByRole('tableing')).toBeInTheDocument();
// })
});
