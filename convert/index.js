const { spawn } = require('child_process');

module.exports.convert = async (event, context) => {
  const child = spawn('ffmpeg', ['-version']);

  let data = ""

  for await (const chunk of child.stdout) {
     data += chunk;
  }

  let error = "";
  for await (const chunk of child.stdout) {
    error += chunk;
  }

  const exitCode = await new Promise( (resolve, reject) => {
    child.on('close', resolve);
  });

  return {
    event,
    data,
    exitCode,
    error,
  }
};
