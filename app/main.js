const net = require("net");

let DATASTORE = new Map();
let commandMessage = "PONG";

const server = net.createServer();
server.on("connection", (socket) => {
  socket.on("data", (data) => {
    
    let { commandName, key, value } = parseData(data);
    switch(commandName){
			case "echo":
				commandMessage = key;
				break;
			case "set":
				DATASTORE.set(key, value);
				commandMessage = 'OK';
				break;
			case "get":
				let storeValue = DATASTORE.get(key);
				commandMessage = !storeValue ? null : storeValue;
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
	return { commandName, key, value }
};

server.listen(6379, "127.0.0.1");
