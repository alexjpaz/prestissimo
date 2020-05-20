import React from 'react';

function NOOP() {}

const loadAudioFile = async (file) => {
  return await new Promise((res, rej) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const dataURL = e.target.result;
        return res(dataURL);
      } catch(e) {
        return rej(e);
      }
    };

    reader.onerror = rej;

    reader.readAsDataURL(file);
  });
};

export const AudioFileInput = ({ onClose = NOOP }) => {
  const fileRef = React.useRef(null);

  const [ data, setData ] = React.useState({
    fileLoaded: false
  });

  const onChange = async (e) => {
    const file = e.target.files[0];

    try {
      const dataUri = await loadAudioFile(file);

      setData({
        fileLoaded: true,
        dataUri
      });

      onClose(dataUri);
    } catch(e) {
      window.alert("Invalid workbook:" + e.message);
    }
  };

  return (
    <React.Fragment>
      { data.fileLoaded &&
      <audio data-testid='file-loaded' controls src={data.dataUri}> </audio>
      }
      <div className="file">
        <label className="file-label">
          <input
            hidden
            ref={fileRef}
            data-testid='file'
            name='file'
            type='file'
            accept=".wav, .aif"
            onChange={onChange} />

          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">
              Choose a file…
            </span>
          </span>
        </label>
      </div>
    </React.Fragment>
  );
}
