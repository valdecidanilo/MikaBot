import * as Fs from 'fs'
import * as Path from 'path'
import { v4 as uuidv4 } from 'uuid';
import Axios from 'axios'
import md5 from 'md5';

export const downloadAudio = (bucketPath: string, hash: string) => {
  return new Promise(async (resolve, reject) => {
    var url = `https://storage.googleapis.com/vocodes-public${bucketPath}`;
    const path = Path.resolve(__dirname, '../../audios', hash + '.wav');

    const response = await Axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    })

    response.data.pipe(Fs.createWriteStream(path))
    response.data.on('end', resolve)
    response.data.on('error', reject);
  })
}

export const status = async (inferenceJobToken: string) => {
  try {
    var result = await Axios.get(`https://api.fakeyou.com/tts/job/${inferenceJobToken}`);

    console.log(result?.data?.state?.status);

    return result?.data?.state?.status === "complete_success"
      ? result.data?.state?.maybe_public_bucket_wav_audio_path
      : null
  } catch (e) {
    return null;
  }
}

export const inference = async (text: string) => {
  var payload = JSON.stringify({
    uuid_idempotency_token: uuidv4(),
    tts_model_token: "TM:9rhan0r24wm3",
    inference_text: text + "."
  });

  var headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }

  var inferenceResponse = await Axios.post("https://api.fakeyou.com/tts/inference", payload, { headers });
  return inferenceResponse?.data?.inference_job_token;
}

export const isCached = (hash: string) => {
  const path = Path.resolve(__dirname, '../../audios', hash + '.wav');
  return Fs.existsSync(path);
}

export const give = async (hash: string) => {
  const path = Path.resolve(__dirname, '../../audios', hash + '.wav');
  return path;
}

export const tts = async (text: string) => {
  const hash = md5(text);

  if (isCached(hash)) return await give(hash)

  const token = await inference(text);

  console.log(token);

  for (var i = 0; i < 60; i++) {
    var result = await status(token);
    if (result) {
      await downloadAudio(result, hash);
      return await give(hash)
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}