import React from 'react';

import { AddTrackButton } from './AddTrackButton';
import { AudioFileInput } from './AudioFileInput';

import { CoverArtField } from './CoverArtField';

import FileHelper from '../helpers/FileHelper';

const generateId = () => {
  return window.crypto.getRandomValues(new Uint32Array(1)).toString(32)
};

export function UploadForm({ onUpload }) {
  const [ manifest, setManifest ] = React.useState({});

  const [ form, setForm ] = React.useState({});

  const handleFileChange = (it) => {
    let title = it.file.name;
    title = title.replace(/\.(wav|aif)$/g, '');

    setForm({
      title,
    });
  };

  const updateField = (name) => {
    return (e) => {
      let f = { ...form };

      f[name] = e.target.value;

      setForm(f);
    };
  };

  const onSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    let manifest = {
      version: 1,
      items: []
    };

    let fileinputs = [];

    if(Array.isArray(e.target.file)) {
      fileinputs = e.target.file
    } else {
      fileinputs = [e.target.file];
    }

    for(let fileinput of fileinputs) {
      for(let file of fileinput.files) {
        let item = {};

        item.id = generateId();

        item.coverart = e.target.coverart.value;

        item.file = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
        };

        item.data = await FileHelper.readAsDataURL(file);

        item.targets = [
          { format: "mp3" } // TODO
        ]

        manifest.items.push(item);
      }
    }

    onUpload(manifest);

    setManifest({ manifest });
  };

  return (
    <div data-testid='UploadForm'>
      <section class="hero is-primary">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Upload Track
            </h1>
          </div>
        </div>
      </section>
      <section class="section">
        <form onSubmit={onSubmit}>
          <div class="columns">
            <div class="column is-one-quarter">
              <CoverArtField value={form.title} />
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Track Title</label>
                <div class="control">
                  <input class="input" name="title" defaultValue={form.title} onChange={updateField('title')} type="text" placeholder="Name the track" />
                </div>
              </div>
              <div class="field">
                <label class="label">Tags</label>
                <div class="control">
                  <input class="input" name="tags" type="text" placeholder="Space separated tags (e.g. chill hiphop)" />
                </div>
              </div>
              <div class="field">
                <label class="label">Description</label>
                <div class="control">
                  <textarea class="textarea" name="description" placeholder="Description of the track"></textarea>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <AudioFileInput onFileChange={handleFileChange} />
                </div>
              </div>
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <button className="button is-primary">Submit</button>
                </div>
                <div className="control">
                  <button className="button is-default is-light">Cancel</button>
                </div>
              </div>
            </div>

          </div>
        </form>
      </section>
    </div>
    );
    }
