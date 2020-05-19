import React from 'react';

export function UploadForm() {
  return (
    <div data-testid='UploadForm'>
      <form>
        <label htmlFor='audio'>Audio</label>
        <input data-testid='audio' name='audio' type='file' accept='.wav, .aif' />
      </form>
    </div>
  );
}
