const net = require("net");
const server = net.createServer((connection) => {
  // Handled connection
  connection.on("data", (data) => {
    // connection.write("+PONG\r\n");
    const command = data.toString().split("\r\n");
    console.log(command);
    switch (command[2].toUpperCase()) {
      case "PING" || "ping":
        connection.write("+PONG\r\n");
        break;
      case "ECHO":
        // if the command has the expected format
        if (command.length >= 4) {
          // Send the echoed string back to the client
          connection.write("+" + command[4] + "\r\n");
        } else {
          // If the command doesn't have the expected format, send an error message
          connection.write(
            "-ERR wrong number of arguments for 'echo' command\r\n"
          );
        }
        break;
      default:
        connection.write("-ERR unknown command\r\n");
        break;
    }
  });

});

server.listen(6379, "127.0.0.1");
