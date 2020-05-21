import React from 'react';

import { AudioFileInput } from './AudioFileInput';

import FileHelper from '../helpers/FileHelper';

const generateId = () => {
  return window.crypto.getRandomValues(new Uint32Array(1)).toString(32)
};

export function UploadForm() {
  const [ data, setData ] = React.useState({});

  const onSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    let manifest = {
      version: 1,
      items: []
    };

    for(let fileinput of e.target.file) {
      for(let file of fileinput.files) {
        let item = {};

        item.id = generateId();

        item.data = await FileHelper.readAsDataURL(file);

        item.targets = [
          { format: "mp3" } // TODO
        ]

        manifest.items.push(item);
      }
    }


    console.log(123);
    //setData({ manifest });
  };

  return (
    <div data-testid='UploadForm'>
      <div className="box">
        <div className='content'>
          <h2>Upload Files</h2>
        </div>
        <form onSubmit={onSubmit}>
          <AudioFileInput />
          <AudioFileInput />
          <hr />
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-link">Submit</button>
            </div>
            <div className="control">
              <button className="button is-link is-light">Cancel</button>
            </div>
          </div>
        </form>
      </div>
      <pre>{JSON.stringify(data,null,2)}</pre>
    </div>
  );
}
