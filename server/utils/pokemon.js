const axios = require('axios');

async function getPokemonData(count) {
  const maxPokemonId = 1000;
  const selectedPokemonIds = generateRandomPokemonIds(maxPokemonId, count);

  const pokemonPromises = selectedPokemonIds.map(async (pokemonId) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    const { name, stats, types, sprites } = response.data;

    // formatting data to store only we need to display
    const data = {
      name,
      stats: stats.map(statData => ({
        name: statData.stat.name,
        baseStat: statData.base_stat
      })),
      types: types.map(typeData => ({
        name: typeData.type.name
      })),
      image: sprites.other['official-artwork'].front_default
    }

    return data;
  });

  try {
    const selectedPokemon = await Promise.all(pokemonPromises);
    return selectedPokemon;
  } catch (error) {
    console.error('Error fetching Pokemon:', error.message);
    throw error;
  }
}

function generateRandomPokemonIds(maxId, count) {
  const randomIds = new Set();

  while (randomIds.size < count) {
    const randomId = Math.floor(Math.random() * maxId) + 1;
    randomIds.add(randomId);
  }

  return Array.from(randomIds);
}

module.exports = { getPokemonData };
