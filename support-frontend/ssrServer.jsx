// @flow
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { css } from '@emotion/core';
// import { CacheProvider } from '@emotion/react';
// import createEmotionServer from '@emotion/server/create-instance';
// import createCache from '@emotion/cache';

import { extractCritical } from 'emotion-server';
// import { renderToString } from 'react-dom/server';
import { cache } from 'emotion';
import { CacheProvider } from '@emotion/core';

const makeItRed = css`
  color: red;
`;

// const key = 'custom'
// const cache = createCache({ key })
// const { extractCritical } = createEmotionServer(cache)

const HelloWorld = (
  <CacheProvider value={cache}>
    <h1 css={makeItRed}>hello world?</h1>
  </CacheProvider>
);

const critical = extractCritical(renderToString(HelloWorld));

console.log('critical --->', critical);

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send(renderToString(HelloWorld));
});

app.listen(port, () => console.log(`server is listening on ${port}`));
