const { Server } = require("socket.io");
const { createServer } = require("http");
const { getPokemonData } = require('./utils/pokemon');
const { sendRequestToOpenAI } = require('./openai');

const httpServer = createServer();  
const io = new Server(httpServer,{
    cors: {
      // origin: "http://localhost:3001"
      origin: "*"
    }
  });

// Keep track of connected clients
const clients = [];

const serverRooms = [];

const clientsConnected = () => {
  console.log(`Clients connected: ${clients.length}`)
}

const selectedPokemon = {};

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

      const countRooms = serverRooms.length + 1
      const room = `room${countRooms}`
      client1.join(room)
      client2.join(room)

      setTimeout(() => {
        getPokemonData(3).then((pokemonData) => {
          client1.pokemonData = pokemonData;
          io.to(client1.id).emit('pokemonData', { pokemons: pokemonData });
        });
        getPokemonData(3).then((pokemonData) => {
          client2.pokemonData = pokemonData;
          io.to(client2.id).emit('pokemonData', { pokemons: pokemonData });
        });

        //Broadcast room subscribed
        io.to(client1.id).emit('subscribedTo', room);
        io.to(client2.id).emit('subscribedTo', room);
      }, 5000)
    }
  });

  // You can handle other events or broadcast messages here

  // Wait for both clients to select their Pokémon
  socket.on("selectedPokemon", ({pokemon, room}) => {

/*     // Get the list of rooms for this socket
    const rooms = io.sockets.adapter.rooms.get(socket.id); */
  
    console.log(`${socket.id} selected ${pokemon} on ${room}`);

    selectedPokemon[socket.id] = pokemon;

    // Check if both clients in the room have selected their Pokémon
    const [client1, client2] = Object.keys(selectedPokemon);

    if (selectedPokemon[client1] && selectedPokemon[client2]) {
      initiateBattle(client1, client2, room);
    }
  });

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

const initiateBattle = (client1, client2, room) => {
  // Implement your battle logic here
  // You can access the selected Pokémon using client1.selectedPokemon and client2.selectedPokemon
  // Send battle results to clients using io.to(client1.id).emit() and io.to(client2.id).emit()
  console.log("Battle initiated!");

/*   let request = {
    battle: {
      player1: {
        pokemon: selectedPokemon[client1]
      },
      player2: {
        pokemon: selectedPokemon[client2]
      },
    }
  } */

  // Random winner - TEMPORARY
  const randomWinner = Math.floor(Math.random() * 100) + 1
  let outcome
  if (randomWinner <= 45) {
    outcome = 'pokemon1'
  } else if (randomWinner >= 46 & randomWinner <= 90) {
    outcome = 'pokemon2'
  } else {
    outcome = 'draw'
  }

  // Send the outcome to the room subscribers
  io.to(room).emit("battleOutcome", outcome)

  // result = sendRequestToOpenAI(JSON.stringify(request));

  console.log(outcome)
};

// io.listen(3000);
// Listen on all available network interfaces and port 3000
httpServer.listen(3001, "0.0.0.0", () => {
  console.log("Server is running on http://0.0.0.0:3001");
});