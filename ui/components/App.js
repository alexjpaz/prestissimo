import React from 'react';

import { Navbar } from './layout/Navbar';

import { UploadForm } from './UploadForm';

import { AppContext } from './AppContext';

export function App() {
  const ctx = React.useContext(AppContext);

  return (
    <div data-test-id='App-root'>
      <Navbar />
      <UploadForm onUpload={ctx.uploadTrack} />
    </div>
  );
}
