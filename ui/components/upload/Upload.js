import React from 'react';

import { UploadForm } from '../UploadForm';
import { AppContext } from '../AppContext';

import { Switch, Route } from "react-router-dom";

export function Upload() {
  const ctx = React.useContext(AppContext);

  return (
    <Switch>
      <Route render={() => {
        return (
          <>
          <UploadForm onUpload={ctx.uploadTrack} />
          { ctx.uploadThing &&
              <div className='section'>
              <progress className="progress is-primary" value={ ctx.progress } max="100">{ ctx.progress }%</progress>
              <button className='button is-fullwidth' disabled={true}>{ ctx.uploadThing.item.status }</button>
              </div>
          }
          <pre>{JSON.stringify(ctx,null,2)}</pre>
          </>
        );
      }} />
    </Switch>
  )
}
