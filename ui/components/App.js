import React from 'react';

import { UploadForm } from './UploadForm';

import { AppContext } from './AppContext';

export function App() {
  const ctx = React.useContext(AppContext);

  return (
    <div data-test-id='App-root'>
      <h1>client = {ctx.user.name}</h1>
      <UploadForm onUpload={ctx.uploadTrack} />
    </div>
  );
}
