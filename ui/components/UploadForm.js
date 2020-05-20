import React from 'react';

import { AudioFileInput } from './AudioFileInput';

const generateId = () => {
  return window.crypto.getRandomValues(new Uint32Array(1)).toString(32)
};

export function UploadForm() {
  const [ data, setData ] = React.useState({});

  return (
    <div data-testid='UploadForm'>
      <div className="box">
        <div className='content'>
          <h2>Upload Files</h2>
        </div>
        <AudioFileInput onClose={e => {
          let manifest = {
            version: 1,
            items: {
              id: generateId(),
              data: "BASE_64",
              targets: [
                { format: "mp3" }
              ]
            }
          };
          setData(manifest);
        }
        } />
      </div>
      <pre>{JSON.stringify(data,null,2)}</pre>
    </div>
  );
}
