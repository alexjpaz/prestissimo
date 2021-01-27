import React from 'react';

import {
  styles,
  brandLogo
} from './Branding'


export function LandingPageBranding() {
  return (
    <>
      <img src={ brandLogo } style={{height:'200px'}} />
    <br />
      <span style={styles.branding}>PRESTISSIMO</span>
    </>
  );
}
