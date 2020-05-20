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
        file,
        fileLoaded: true,
        dataUri
      });

      onClose(dataUri);
    } catch(e) {
      window.alert("Invalid workbook:" + e.message);
    }
  };

  const play = () => {
    const audio = new Audio();
    audio.src = data.dataUri;
    audio.play();
  }

  const fileInput = (
    <input
      hidden
      ref={fileRef}
      data-testid='file'
      name='file'
      type='file'
      accept=".wav, .aif"
      onChange={onChange} />
  );

  return (
    <div>
      <div className="file has-name">
        <button className="button is-info" disabled={!data.dataUri} onClick={play}>
          <i className="fas fa-play"></i>
        </button>
        <label className="file-label">
          {fileInput}
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">
              Choose a file…
            </span>
          </span>
          { data.file &&
              <span className="file-name" data-testid='file-name'>
                {data.file.name}
              </span>
          }
            </label>

          </div>
        </div>
  );
}
