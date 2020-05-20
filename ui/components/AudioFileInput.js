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
      <div class="file has-name">
        <button class="button is-info" disabled={!data.dataUri} onClick={play}>
          <i class="fas fa-play"></i>
        </button>
        <label class="file-label">
          {fileInput}
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              Choose a file…
            </span>
          </span>
          { data.file &&
              <span class="file-name">
                {data.file.name}
              </span>
          }
            </label>

          </div>
        </div>
  );
}
