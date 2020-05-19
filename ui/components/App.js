import React from 'react';

import { UploadForm } from './UploadForm';

export function App() {
  return (
    <div data-test-id='App-root'>
      <div className='section'>
        <UploadForm />
      </div>
    </div>
  );
}
