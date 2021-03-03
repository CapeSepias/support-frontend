// @flow
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import { cache } from 'emotion';
import { CacheProvider } from '@emotion/core';
import { Button } from '@guardian/src-button';
import { HelloWorld } from './components/HelloWorld';
import { ShowcasePage } from './pages/showcase/ShowcasePage';

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  const App = (
    <CacheProvider value={cache}>
      <HelloWorld />
      <ShowcasePage />
      <Button
        priority="primary"
        size="small"
        onClick={() => {
          console.log('click!');
        }}
      >
                Check date
      </Button>
    </CacheProvider>
  );

  const critical = extractCritical(renderToString(App));

  res
    .status(200)
    .header('Content-Type', 'text/html')
    .send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>SSR test</title>
            <style data-emotion="${critical.ids.join(' ')}">${critical.css}</style>
        </head>
        <body>
            <div id="root">${critical.html}</div>
        </body>
        </html>`);
});

app.listen(port, () => console.log(`server is listening on ${port}`));
