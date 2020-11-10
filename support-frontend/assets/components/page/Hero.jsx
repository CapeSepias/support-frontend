// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { brand, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { headline, body } from '@guardian/src-foundations/typography';


type PropTypes = {|
  image: Node,
  children: Node,
  cssOverrides?: string,
  roundelText?: Node,
|}

const hero = css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${neutral[100]};
  border: none;
  padding-top: ${space[3]}px;
  background-color: ${brand[400]};
  width: 100%;

  ${from.tablet} {
    flex-direction: row;
  }


  /* Typography defaults */
  ${body.small()};

  ${from.mobileMedium} {
    ${body.medium()};
  }

  ${from.desktop} {
    ${headline.xxsmall()};
    line-height: 135%;
  }
`;

const heroImage = css`
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-shrink: 0;
  width: 100%;

  ${from.tablet} {
    width: 40%;
  }

  & img {
    max-width: 100%;
  }
`;

const heroRoundel = css`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  transform: translateY(-50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${brandAlt[400]};
  color: ${neutral[7]};
  ${headline.xxsmall({ fontWeight: 'bold' })};
  z-index: 2;

  ${from.tablet} {
    width: 180px;
    height: 180px;
    right: ${space[12]}px;
    ${headline.small({ fontWeight: 'bold' })};
  }
`;

function Hero({
  children, image, cssOverrides, roundelText,
}: PropTypes) {
  return (
    <div css={[hero, cssOverrides]}>
      {roundelText && <div css={heroRoundel}>{roundelText}</div>}
      {children}
      <div css={heroImage}>
        {image}
      </div>
    </div>
  );
}

Hero.defaultProps = {
  cssOverrides: '',
  roundelText: null,
};

export default Hero;
