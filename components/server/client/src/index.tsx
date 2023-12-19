import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';

import { ThemeProvider } from '@mui/material/styles';
import Theme from 'Theme';

import { createBrowserHistory } from 'history';

const replaceHashPath = () => {
  const history = createBrowserHistory();
  const hash = history.location.hash;
  if (hash) {
    const path = hash.replace(/^#/, '');
    if (path) {
      history.replace(path);
    }
  }
  ReactDOM.render(
    <ThemeProvider theme={Theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>,
    document.getElementById('root')
  );
};
replaceHashPath();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
