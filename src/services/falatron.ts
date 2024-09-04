import * as ws from 'ws';
import * as Fs from 'fs'
import * as Path from 'path'
import * as md5 from 'md5';

var _conn: ws.WebSocket;
var _callback: (base64: string) => void;

export const isCached = (hash: string) => {
  const path = Path.resolve(__dirname, '../../audios', hash + '.mp3');
  return Fs.existsSync(path);
}

export const give = async (hash: string) => {
  const path = Path.resolve(__dirname, '../../audios', hash + '.mp3');
  return path;
}

export const initFalatron = () => {
  const wss = new ws.WebSocketServer({ port: 8080 });
  wss.on("connection", conn => {
    _conn = conn;
    _conn.onmessage = message => {
      var { voice, hash } = JSON.parse(message.data.toString());
      console.log(hash);

      const path = Path.resolve(__dirname, '../../audios', hash + '.mp3');
      Fs.writeFileSync(path, Buffer.from(voice, "base64"));
      _callback(path);
    };
  });
}

export const send = async (text: string) => {
  const hash = md5(text);

  if (isCached(hash)) {
    var content = await give(hash);
    _callback(content);
    return;
  }

  _conn.send(JSON.stringify({ hash, text }));
}

export const receive = (clb: (base64: string) => void) => _callback = clb;