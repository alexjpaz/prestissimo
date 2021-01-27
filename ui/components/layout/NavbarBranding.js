import React from 'react';

export const styles = {
  branding: {
    "fontFamily": "Bebas Neue, Sans-Serif",
  }
};

export const brandLogo = window.Prestissimo.RouterBasename + "/assets/logo.svg";

export function Branding() {
  return (
    <React.Fragment>
      <img src={ brandLogo }  />
      <span style={styles.branding}>PRESTISSIMO</span>
    </React.Fragment>
  );
}
