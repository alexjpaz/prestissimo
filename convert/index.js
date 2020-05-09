const { spawn } = require('child_process');
const { promisify } = require('util');
const { pipeline } = require('stream');
const asyncPipeline = promisify(pipeline);
const os = require('os');
const fsp = require('fs').promises;
const path = require('path');

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: 'us-east-1'
});

const cacheObjectToFilesystem = async (inputRecord) => {
  const tempPath = path.join(os.tmpdir(), 'convert-');
  const outputDir = await fsp.mkdtemp(tempPath);

  console.log("Caching object", inputRecord.s3.bucket.name, inputRecord.s3.object.key);
  const rsp = await s3.getObject({
    Bucket: inputRecord.s3.bucket.name,
    Key: inputRecord.s3.object.key,
  }).promise();

  const outputPath = path.join(outputDir,  "step1");

  await fsp.writeFile(outputPath, rsp.Body);

  return {
    outputPath
  };
};

const ffmpeg = async (inputFile, outputFile) => {
  console.log(inputFile, outputFile);
  const child = spawn('ffmpeg', [
    '-y',
    '-i', inputFile,
    '/tmp/foo.mkv'
  ]);

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
    data,
    exitCode,
    error,
  }

};

module.exports.convert = async (event, context) => {
  // FIXME - It is just the first object for now
  const Record = event.Records[0];

  const { outputPath } = await cacheObjectToFilesystem(Record);

  try {
    console.log('converting');
    const rsp = await ffmpeg(outputPath, "/tmp/foo.mkv");

    // FIXME
    console.log('UPLOADING');
    await s3.putObject({
      Bucket: "prestissimo-dev",
      Key: `test/${Record.s3.object.key}`,
      Body: await fsp.readFile("/tmp/foo.mkv")
    }).promise();

    console.log('done');
  } catch(e) {
    console.error(e);
    throw e;
  } finally {
    await fsp.unlink(outputPath);
  }
 };
