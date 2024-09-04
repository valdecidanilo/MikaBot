var tts = async (hash, text) => {
    var body = new FormData();
    body.append("voz", "Salsicha");
    body.append("texto", text);

    var result = await fetch("https://falatron.com/tts", {
        "body": body,
        "method": "POST",
    });
    var json = await result.json();
    return { hash, voice: json.voice };
}

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
// socket.addEventListener('open', (event) => {
//     socket.send('Hello Server!');
// });

// Listen for messages
socket.addEventListener('message', async (event) => {
    console.log('Message from server ', event.data);
    var { hash, text } = JSON.parse(event.data);
    var data = await tts(hash, text);
    socket.send(JSON.stringify(data));
});