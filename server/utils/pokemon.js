const axios = require('axios');

async function getPokemonData(count) {
  const maxPokemonId = 1025;

  const selectedPokemonIds = generateRandomPokemonIds(maxPokemonId, count);

  const pokemonPromises = selectedPokemonIds.map(async (pokemonId) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    const { name, stats, types, sprites } = response.data;

    // formatting data to store only we need to display
    const allStatsObject =
      stats.map(statData => ({
        [formatBaseStatsName(statData.stat.name)]: statData.base_stat,
      }))

    const allStats = allStatsObject.reduce((acc, element) => {
      const chave = Object.keys(element)[0];
      acc[chave] = element[chave];
      return acc;
    }, {});

    const level = 50;

    const data = {
      name,
      baseStats: stats.map(statData => ({
        name: formatBaseStatsName(statData.stat.name),
        baseStat: statData.base_stat
      })),
      stats: calculateRandomStats({ ...allStats, level: level }),
      types: types.map(typeData => ({
        name: typeData.type.name
      })),
      image: sprites.other['official-artwork'].front_default,
      imageShiny: sprites.other['official-artwork'].front_shiny,
      level: level,
      isShiny: isShiny()
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

function isShiny() {
  // Assuming a 1 in 1024 chance
  const shinyChance = 1 / 1024;

  // Generate a random number between 0 and 1
  const randomValue = Math.random();

  // Check if the random value falls within the shiny chance
  return randomValue <= shinyChance;
}

function formatBaseStatsName(baseStatName) {
  switch (baseStatName) {
    case 'hp':
      return 'baseHp'
    case 'attack':
      return 'baseAttack'
    case 'defense':
      return 'baseDefense'
    case 'special-attack':
      return 'baseSpecialAttack'
    case 'special-defense':
      return 'baseSpecialDefense'
    case 'speed':
      return 'baseSpeed'
    default:
      return ''
  }
}

function formatStatsName(statName) {
  switch (statName) {
    case 'hp':
      return 'Hp'
    case 'attack':
      return 'Attack'
    case 'defense':
      return 'Defense'
    case 'special-attack':
      return 'SpecialAttack'
    case 'special-defense':
      return 'SpecialDefense'
    case 'speed':
      return 'Speed'
    default:
      return ''
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

function calculateStat(stat, baseStat, IV, EV, level) {
  // Ensure that EV is within the allowed range (0 to 255)
  EV = Math.min(255, Math.max(0, EV))

  // Ensure that the sum of all EVs is within the allowed range (0 to 255)
  const totalEVs = Math.min(255, EV);

  let constant = 5
  if (stat === 'hp') {
    constant = level + 10
  }

    // Calculate and return the actual stat
  return Math.floor(((2 * baseStat + IV + Math.floor(totalEVs / 4)) * level) / 100 + constant);
}

function calculateRandomStats({ level, baseHp, baseAttack, baseDefense, baseSpecialAttack, baseSpecialDefense, baseSpeed }) {
  // level = 50
  console.log({ level, baseHp, baseAttack, baseDefense, baseSpecialAttack, baseSpecialDefense, baseSpeed })
  const randomIV = () => {
    return Math.floor(Math.random() * 32); // Random IV between 0 and 311
  }

  let totalEV = 511;
  const randomEV = () => {
    let maxEV = Math.floor(Math.random() * totalEV);
    totalEV = totalEV - maxEV;

    return maxEV;
  }

  const calculateStatObject = (name, baseStat) => ({
    name,
    stat: calculateStat(name, baseStat, randomIV(), randomEV(), level),
  });

  return [
    calculateStatObject('hp', baseHp),
    calculateStatObject('attack', baseAttack),
    calculateStatObject('defense', baseDefense),
    calculateStatObject('specialAttack', baseSpecialAttack),
    calculateStatObject('specialDefense', baseSpecialDefense),
    calculateStatObject('speed', baseSpeed),
  ];

  /*   return {
      hp: calculateStat('hp', baseHp, randomIV(), randomEV(), level),
      attack: calculateStat('attack', baseAttack, randomIV(), randomEV(), level),
      defense: calculateStat('defense', baseDefense, randomIV(), randomEV(), level),
      specialAttack: calculateStat('specialAttack', baseSpecialAttack, randomIV(), randomEV(), level),
      specialDefense: calculateStat('specialDefense', baseSpecialDefense, randomIV(), randomEV(), level),
      speed: calculateStat('speed', baseSpeed, randomIV(), randomEV(), level),
    }; */
}

// Example usage:
/* const result = calculateRandomStats({
  level: 50,
  baseHp: 100,
  baseAttack: 75,
  baseDefense: 115,
  baseSpecialAttack: 90,
  baseSpecialDefense: 115,
  baseSpeed: 85,
});

console.log(result); */

module.exports = { getPokemonData };
