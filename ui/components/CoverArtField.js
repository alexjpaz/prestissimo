import React from 'react';

const palettes = [
  { text: "#e5e5e5", background: "#303960" },
  { text: "#f1ebbb", background: "#45046a" },
];

const getRandomPalette = function() {
  return palettes[Math.floor(Math.random() * palettes.length)];
};

export function CoverArtField({ value = "Track Title" }) {
  const [ dataURL, setDataUrl ] = React.useState(null);

  React.useEffect(() => {
    let text = value.replace(' ', '\n');
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;

    const context = canvas.getContext("2d");

    if(!context) {
      // TODO
      console.warn("Canvas context not supported in this environment");
      return setDataUrl();
    }

    context.textBaseline = 'middle';
    context.textAlign = "center";

    const palette = getRandomPalette();

    context.fillStyle = palette.background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let fontFace = "Sans-Serif";
    var fontsize=1000;

    do{
        fontsize -= 10;
        context.font=`bold ${fontsize}px ${fontFace}`;
    }while(context.measureText(text).width>canvas.width)

    context.fillStyle = palette.text;
    context.fillText(text, (canvas.width / 2), (canvas.height / 2));

    const dataURL = canvas.toDataURL("image/png");

    setDataUrl(dataURL);

    context.clearRect(0, 0, canvas.width, canvas.height)
  }, [ value ]);

  return (
    <div className="field">
      <label className="label">Cover Art</label>
      <div className="control">
        <input type='hidden' name='coverart' defaultValue={dataURL} />
        <img src={dataURL} />
      </div>
    </div>
  );
}
