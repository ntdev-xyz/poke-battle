const { Server } = require("socket.io");
const { createServer } = require("http");
const { getPokemonData } = require('./utils/pokemon');

const httpServer = createServer();  
const io = new Server({
    cors: {
      origin: "http://localhost:3001"
    }
  });

// Keep track of connected clients
const clients = [];

const clientsConnected = () => {
  console.log(`Clients connected: ${clients.length}`)
}

// Representa uma instância da conexão
io.on("connection", (socket) => {
  console.log(`New connection from ${socket.id} at ${new Date().toString()}`)
  // Handle the initial connection and receive the username
  socket.on("setUsername", (username) => {
    console.log(`Username set: ${username}`);

    // Store the username with the socket ID (you might want to use a database for this in a real application)
    socket.username = username;

    // Add the socket to the clients array
    clients.push(socket);
    clientsConnected()
    socket.emit("hello",`Welcome ${socket.username}`)

    // Check if we have two connected clients
    if (clients.length === 2) {
      // Link the first two connections
      const [client1, client2] = clients;

      // Example: Send a message from client1 to client2
      client1.rival = client2
      client1.emit("linkClients", { message: `You are linked with ${client2.username}!`});

      // Example: Send a message from client2 to client1
      client2.rival = client1
      client2.emit("linkClients", { message: `You are linked with ${client1.username}!`});

      setTimeout(() => {
        getPokemonData(3).then((pokemonData) => {
          io.to(client1.id).emit('pokemonData', { pokemons: pokemonData });
        });
        getPokemonData(3).then((pokemonData) => {
          io.to(client2.id).emit('pokemonData', { pokemons: pokemonData });
        });
      }, 5000)

    }
  });

  // You can handle other events or broadcast messages here

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Remove the disconnected socket from the clients array
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    clientsConnected()
  });
});



io.on("disconnection", (socket) => {
  console.log(`${socket.id} disconnected at ${new Date().toString()}`)
});

io.listen(3000);