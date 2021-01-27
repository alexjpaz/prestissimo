import React from 'react';

export const styles = {
  branding: {
    "fontFamily": "Bebas Neue, Sans-Serif",
  }
};

export const brandLogo = (function () {
  if(!window || !window.Prestissimo || !window.Prestissimo.RouterBasename) {
    return 'https://localhost:3000/local/assets/logo.svg';
  }

  return window.Prestissimo.RouterBasename + "/assets/logo.svg";
})();

export function Branding() {
  return (
    <React.Fragment>
      <img src={ brandLogo }  />
      <span style={styles.branding}>PRESTISSIMO</span>
    </React.Fragment>
  );
}
