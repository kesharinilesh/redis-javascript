const net = require("net");

let DATASTORE = new Map();
let commandMessage = "PONG";

const server = net.createServer();
server.on("connection", (socket) => {
  socket.on("data", (data) => {
    
    let { commandName, key, value ,px} = parseData(data);
    switch(commandName){
			case "echo":
				commandMessage = key;
				break;
			case "set":
				DATASTORE.set(key, value);
				commandMessage = 'OK';
        if (px) setTimeout(() => DATASTORE.delete(key), px);
				break;
			case "get":
				let storeValue = DATASTORE.get(key);
        if(!storeValue){
					return socket.write(`$-1\r\n`);
				}
				commandMessage = storeValue;
				break;
		}
    
    socket.write(`+${commandMessage}\r\n`);
  });
});
const parseData = (request) => {
	let data = request.toString().split("\r\n");
  let commandName = data[2];
  let key = data[4];
  let value = data[6];
  let px = data[10];
	return { commandName, key, value,px }
};

server.listen(6379, "127.0.0.1");
