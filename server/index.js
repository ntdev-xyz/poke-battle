const { Server } = require("socket.io");
const { createServer } = require("http");
const { getPokemonData } = require('./utils/pokemon');
const { geminiGenerateResponse } = require('./googleAI');
const { writeBattleLog, newBattleLog } = require("./utils/logger");


const httpServer = createServer();
const io = new Server(httpServer, {
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
const clientUsernames = {}
const clientPokemons = {}
const clientRivals = {}
const faintedPokemons = {}

// Representa uma instância da conexão
io.on("connection", (socket) => {
  console.log(`New connection from ${socket.id} at ${new Date().toString()}`)
  if (clients.length >= 2) {
    socket.disconnect(true)
    console.log(`Disconnected ${socket.id}: Too much clients`)
    return
  }
  // Handle the initial connection and receive the username
  socket.on("setUsername", (username) => {
    console.log(`Username set: ${username}`);

    // Store the username with the socket ID (you might want to use a database for this in a real application)
    clientUsernames[socket.id] = username;

    // Add the socket to the clients array
    clients.push(socket);
    clientsConnected()

    socket.emit("hello", `Welcome ${username}`)

    // Check if we have two connected clients
    if (clients.length === 2) {
      // Link the first two connections
      const [client1, client2] = clients;

      // Example: Send a message from client1 to client2
      clientRivals[client1] = client2
      client1.emit("linkClients", { message: `You are linked with ${clientUsernames[client2]}!` });

      // Example: Send a message from client2 to client1
      clientRivals[client2] = client1
      client2.emit("linkClients", { message: `You are linked with ${clientUsernames[client1]}!` });

      // clean up selected pokemons from the socket
      selectedPokemon[client1] = undefined
      selectedPokemon[client2] = undefined

      const countRooms = serverRooms.length + 1
      const room = `room${countRooms}`
      client1.join(room)
      client2.join(room)

      setTimeout(() => {
        getPokemonData(3).then((pokemonData) => {
          client1.pokemonData = pokemonData;
          clientPokemons[client1.id] = pokemonData;
          io.to(client1.id).emit('pokemonData', { pokemons: pokemonData });
        });
        getPokemonData(3).then((pokemonData) => {
          client2.pokemonData = pokemonData;
          clientPokemons[client2.id] = pokemonData;
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
  socket.on("selectedPokemon", ({ pokemon, room }) => {

    /*     // Get the list of rooms for this socket
        const rooms = io.sockets.adapter.rooms.get(socket.id); */

    console.log(`${clientUsernames[socket.id]} (${socket.id}) selected ${pokemon.name} on ${room}`);

    selectedPokemon[socket.id] = pokemon;

    // Check if both clients in the room have selected their Pokémon
    // const [client1, client2] = Object.keys(selectedPokemon);
    const [client1, client2] = Object.keys(clientUsernames);

    console.log(`${client1} pokemon: ${selectedPokemon[client1]?.name} // ${client2} pokemon: ${selectedPokemon[client2]?.name}`)

    if (selectedPokemon[client1] && selectedPokemon[client2]) {
      initiateBattle(client1, client2, room);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete clientUsernames[socket.id]
    delete selectedPokemon[socket.id]
    delete clientPokemons[socket.id]
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

const initiateBattle = async (client1, client2, room) => {
  // Implement your battle logic here
  // You can access the selected Pokémon using client1.selectedPokemon and client2.selectedPokemon
  // Send battle results to clients using io.to(client1.id).emit() and io.to(client2.id).emit()

  console.log(`Battle initiated on ${room}!`);
  console.log(clientUsernames)

  io.to(client1).emit('setRivalPokemon', selectedPokemon[client2]);
  io.to(client2).emit('setRivalPokemon', selectedPokemon[client1]);

  const input = {
    "pokemon1": {
      "trainer": clientUsernames[client1],
      "name": selectedPokemon[client1].name,
      "type": selectedPokemon[client1].types.map(
        obj => obj.name.charAt(0).toUpperCase() + obj.name.slice(1)).join('/'),
      "level": selectedPokemon[client1].level,
      "stats": {
        "hp": selectedPokemon[client1].stats[0].stat,
        "attack": selectedPokemon[client1].stats[1].stat,
        "defense": selectedPokemon[client1].stats[2].stat,
        "special-attack": selectedPokemon[client1].stats[3].stat,
        "special-defense": selectedPokemon[client1].stats[4].stat,
        "speed": selectedPokemon[client1].stats[5].stat
      }
    },
    "pokemon2": {
      "trainer": clientUsernames[client2],
      "name": selectedPokemon[client2].name,
      "type": selectedPokemon[client2].types.map(
        obj => obj.name.charAt(0).toUpperCase() + obj.name.slice(1)).join('/'),
      "level": selectedPokemon[client2].level,
      "stats": {
        "hp": selectedPokemon[client2].stats[0].stat,
        "attack": selectedPokemon[client2].stats[1].stat,
        "defense": selectedPokemon[client2].stats[2].stat,
        "special-attack": selectedPokemon[client2].stats[3].stat,
        "special-defense": selectedPokemon[client2].stats[4].stat,
        "speed": selectedPokemon[client2].stats[5].stat
      }
    }
  };

  console.log({ input })

  io.to(room).emit("battleInitiated", input)

  try {
    const logFile = newBattleLog({ room: room });
    writeBattleLog({ file: logFile, dataString: `Battle initiated on ${room}!` })
    writeBattleLog({ file: logFile, dataString: JSON.stringify(input, null, 2) })
    const response = await geminiGenerateResponse(input)
    let cleanResponse = response.replace(/```JSON|```|\n/g, '');
    cleanResponse = JSON.parse(cleanResponse)
    console.log(cleanResponse)
    writeBattleLog({ file: logFile, dataString: JSON.stringify(cleanResponse) })

    /*   // Random winner - TEMPORARY
      const randomWinner = Math.floor(Math.random() * 100) + 1
      let outcome
      if (randomWinner <= 45) {
        outcome = 'pokemon1'
      } else if (randomWinner >= 46 & randomWinner <= 90) {
        outcome = 'pokemon2'
      } else {
        outcome = 'draw'
      } */

    // Send the outcome to the room subscribers
    io.to(room).emit("battleOutcome", cleanResponse)

    let remainingHp1 = input.pokemon1.stats.hp
    let remainingHp2 = input.pokemon2.stats.hp
    const battleLog = cleanResponse && cleanResponse.battleLog;
    if (battleLog) {
      battleLog.forEach((item) => {
        remainingHp1 = remainingHp1 + item.pokemon1HPLost
        remainingHp2 = remainingHp2 + item.pokemon2HPLost
      })

      if (remainingHp1 < 0) {
        remainingHp1 = 0
      }
      if (remainingHp2 < 0) {
        remainingHp2 = 0
      }

      const winner = cleanResponse.winner

      // update HP in pokemon list
      clientPokemons[client1].forEach((pokemon, index) => {
        if (pokemon.name == selectedPokemon[client1].name) {
          pokemon.stats[0].stat = remainingHp1
          if (remainingHp1 <= 0) {
            pokemon.isFainted = true
          }
          console.log(clientPokemons[client1][index])
        }
      })

      clientPokemons[client2].forEach((pokemon, index) => {
        if (pokemon.name == selectedPokemon[client2].name) {
          pokemon.stats[0].stat = remainingHp2
          if (remainingHp2 <= 0) {
            pokemon.isFainted = true
          }
          console.log(clientPokemons[client2][index])
        }
      })

      io.to(client1).emit('battleFinish', { pokemons: clientPokemons[client1], winner: winner === clientUsernames[client1] });
      io.to(client2).emit('battleFinish', { pokemons: clientPokemons[client2], winner: winner === clientUsernames[client2] });
    }

  } catch (error) {
    console.error('Error generating response: ', error)
  }

  // result = sendRequestToOpenAI(JSON.stringify(request));

  // console.log(outcome)
};

// io.listen(3000);
// Listen on all available network interfaces and port 3000
httpServer.listen(3001, "0.0.0.0", () => {
  console.log("Server is running on http://0.0.0.0:3001");
});