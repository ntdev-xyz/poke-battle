const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GOOGLEAI_KEY;

async function geminiGenerateResponse(input) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "Simulate an official Pokemon battle. Will return the winner of the battle and the battle log. It must be used the stats given in this prompt. The HP to be fainted is 0 and the total damage should not be greater than the provided HP in stats. Remaining HP must match the provided HP minus HP lost in the battle log. The pokemons could be the same, so provide which player has won. \nThis is a 1v1 battle and others pokemon could not be used.\nThe last turn is the turn a pokemon fainted.\nCritical hits should be considered.\nFirst pokemon to attack is the one who have the highest speed.\nThe attacker should use its attack and special attack stats.\nThe defender should use its defense and special defense stats.\nThe return is a JSON exemple format given below. \n{\n \"winner\": \"b\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"\"\n  },\n..., // other turns\n{\n   \"turn\": 99,\n   \"action\": \"\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"\"\n}\n  \n ]\n}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player A\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player A's Leafeon used Leaf Blade on Player B's Arcanine!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 20,\n   \"result\": \"Arcanine HP: 180/200\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player B's Arcanine used Flamethrower on Player A's Leafeon!\",\n   \"pokemon1HPLost\": 30,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Leafeon HP: 150/180\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Player A's Leafeon used Razor Leaf on Player B's Arcanine!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 10,\n   \"result\": \"Arcanine HP: 170/200\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Player B's Arcanine used Crunch on Player A's Leafeon!\",\n   \"pokemon1HPLost\": 40,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Leafeon HP: 110/180\"\n  },\n  {\n   \"turn\": 5,\n   \"action\": \"Player A's Leafeon used X-Scissor on Player B's Arcanine!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 20,\n   \"result\": \"Arcanine HP: 150/200\"\n  },\n  {\n   \"turn\": 6,\n   \"action\": \"Player B's Arcanine used Extreme Speed on Player A's Leafeon!\",\n   \"pokemon1HPLost\": 40,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Leafeon HP: 70/180\"\n  },\n  {\n   \"turn\": 7,\n   \"action\": \"Player A's Leafeon used Leaf Blade on Player B's Arcanine!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 20,\n   \"result\": \"Arcanine HP: 130/200\"\n  },\n  {\n   \"turn\": 8,\n   \"action\": \"Player B's Arcanine used Flamethrower on Player A's Leafeon!\",\n   \"pokemon1HPLost\": 30,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Leafeon HP: 40/180\"\n  },\n  {\n   \"turn\": 9,\n   \"action\": \"Player A's Leafeon used Razor Leaf on Player B's Arcanine!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 10,\n   \"result\": \"Arcanine HP: 120/200\"\n  },\n  {\n   \"turn\": 10,\n   \"action\": \"Player B's Arcanine fainted!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 120,\n   \"result\": \"Arcanine HP: 0/200\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "Simulate the battle using the JSON below. Use official battle pokemons rules to simulate.\n{\"pokemon1\":{\"trainer\":\"a\",\"name\":\"dragalge\",\"type\":\"Poison/Dragon\",\"level\":50,\"stats\":{\"hp\":161,\"attack\":85,\"defense\":121,\"special-attack\":118,\"special-defense\":136,\"speed\":62}},\"pokemon2\":{\"trainer\":\"b\",\"name\":\"zamazenta\",\"type\":\"Fighting\",\"level\":50,\"stats\":{\"hp\":10,\"attack\":144,\"defense\":124,\"special-attack\":92,\"special-defense\":127,\"speed\":155}}}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player B\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player B's Zamazenta used Close Combat on Player A's Dragalge!\",\n   \"pokemon1HPLost\": 85,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: 76/161\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player A's Dragalge used Sludge Wave on Player B's Zamazenta!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 66,\n   \"result\": \"Zamazenta HP: -56/10\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Zamazenta fainted!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 10,\n   \"result\": \"Zamazenta HP: 0/10\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "Discard the battle explanation at the end, just generate the JSON file. On pokemon1HPLost and pokemon2HPLost, if healead must be a positive integer, if damaged it must be a negative integer.\n{\"pokemon1\":{\"trainer\":\"a\",\"name\":\"dragalge\",\"type\":\"Poison/Dragon\",\"level\":50,\"stats\":{\"hp\":161,\"attack\":85,\"defense\":121,\"special-attack\":118,\"special-defense\":136,\"speed\":62}},\"pokemon2\":{\"trainer\":\"b\",\"name\":\"zamazenta\",\"type\":\"Fighting\",\"level\":50,\"stats\":{\"hp\":220,\"attack\":144,\"defense\":124,\"special-attack\":92,\"special-defense\":127,\"speed\":155}}}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player B\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player B's Zamazenta used Close Combat on Player A's Dragalge!\",\n   \"pokemon1HPLost\": -85,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: 76/161\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player A's Dragalge used Sludge Wave on Player B's Zamazenta!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -66,\n   \"result\": \"Zamazenta HP: 154/220\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Player B's Zamazenta used Close Combat on Player A's Dragalge!\",\n   \"pokemon1HPLost\": -85,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: -9/161\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Dragalge fainted!\",\n   \"pokemon1HPLost\": -161,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: 0/161\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "If the pokemon HP is 0 or below the turn it takes the hit, that should be the final turn.\n{\"pokemon1\":{\"trainer\":\"Red\",\"name\":\"dragalge\",\"type\":\"Poison/Dragon\",\"level\":50,\"stats\":{\"hp\":161,\"attack\":85,\"defense\":121,\"special-attack\":118,\"special-defense\":136,\"speed\":62}},\"pokemon2\":{\"trainer\":\"Blue\",\"name\":\"zamazenta\",\"type\":\"Fighting\",\"level\":50,\"stats\":{\"hp\":10,\"attack\":144,\"defense\":124,\"special-attack\":92,\"special-defense\":127,\"speed\":155}}}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player B\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player B's Zamazenta used Close Combat on Player A's Dragalge!\",\n   \"pokemon1HPLost\": -161,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: 0/161\"\n  },\n  {\n   \"turn\": 1,\n   \"action\": \"Dragalge fainted!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: 0/161\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "Discard the battle explanation, return just the JSON. If the pokemon HP is 0 or below the turn it takes the hit, that should be the final turn. {\"pokemon1\":{\"trainer\":\"Red\",\"name\":\"dragalge\",\"type\":\"Poison/Dragon\",\"level\":50,\"stats\":{\"hp\":161,\"attack\":85,\"defense\":121,\"special-attack\":118,\"special-defense\":136,\"speed\":62}},\"pokemon2\":{\"trainer\":\"Blue\",\"name\":\"zamazenta\",\"type\":\"Fighting\",\"level\":50,\"stats\":{\"hp\":190,\"attack\":144,\"defense\":124,\"special-attack\":92,\"special-defense\":127,\"speed\":155}}}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player B\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player B's Zamazenta used Close Combat on Player A's Dragalge!\",\n   \"pokemon1HPLost\": -161,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: 0/161\"\n  },\n  {\n   \"turn\": 1,\n   \"action\": \"Dragalge fainted!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Dragalge HP: 0/161\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "{  \"pokemon1\": {    \"trainer\": \"Red\",    \"name\": \"crustle\",    \"type\": \"Bug/Rock\",    \"level\": 50,    \"stats\": {      \"hp\": 90,      \"attack\": 144,      \"defense\": 136,      \"special-attack\": 80,      \"special-defense\": 92,      \"speed\": 50    }  },  \"pokemon2\": {    \"trainer\": \"Blue\",    \"name\": \"gardevoir\",    \"type\": \"Psychic/Fairy\",    \"level\": 50,    \"stats\": {      \"hp\": 161,      \"attack\": 87,      \"defense\": 87,      \"special-attack\": 162,      \"special-defense\": 126,      \"speed\": 98    }  }}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player B\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player A's Crustle used X-Scissor on Player B's Gardevoir!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -80,\n   \"result\": \"Gardevoir HP: 81/161\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player B's Gardevoir used Psychic on Player A's Crustle!\",\n   \"pokemon1HPLost\": -115,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Crustle HP: -25/90\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Crustle fainted!\",\n   \"pokemon1HPLost\": -90,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Crustle HP: 0/90\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "{   \"pokemon1\":{      \"trainer\":\"Red\",      \"name\":\"chansey\",      \"type\":\"normal\",      \"level\":100,      \"stats\":{         \"hp\":704,         \"attack\":50,         \"defense\":46,         \"special-attack\":95,         \"special-defense\":246,         \"speed\":136      }   },   \"pokemon2\":{      \"trainer\":\"Blue\",      \"name\":\"nidoqueen\",      \"type\":\"Poison/Ground\",      \"level\":100,      \"stats\":{         \"hp\":353,         \"attack\":311,         \"defense\":210,         \"special-attack\":167,         \"special-defense\":206,         \"speed\":188      }   }}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player A\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Nidoqueen!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"Nidoqueen HP: 98/353\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player B's Nidoqueen used Earthquake on Player A's Chansey!\",\n   \"pokemon1HPLost\": -237,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Chansey HP: 467/704\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Player A's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 140,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Chansey HP: 607/704\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Nidoqueen!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"Nidoqueen HP: -157/353\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Nidoqueen fainted!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -353,\n   \"result\": \"Nidoqueen HP: 0/353\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "{   \"pokemon1\":{      \"trainer\":\"Red\",      \"name\":\"snorlax\",      \"type\":\"normal\",      \"level\":75,      \"stats\":{         \"hp\":372,         \"attack\":264,         \"defense\":125,         \"special-attack\":112,         \"special-defense\":193,         \"speed\":73      }   },   \"pokemon2\":{      \"trainer\":\"Blue\",      \"name\":\"mewtwo\",      \"type\":\"psychic\",      \"level\":75,      \"stats\":{         \"hp\":286,         \"attack\":233,         \"defense\":182,         \"special-attack\":268,         \"special-defense\":163,         \"speed\":223      }   }}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player B\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player B's Mewtwo used Psychic on Player A's Snorlax!\",\n   \"pokemon1HPLost\": -233,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Snorlax HP: 139/372\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player A's Snorlax used Body Slam on Player B's Mewtwo!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -114,\n   \"result\": \"Mewtwo HP: 172/286\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Player B's Mewtwo used Shadow Ball on Player A's Snorlax!\",\n   \"pokemon1HPLost\": -207,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Snorlax HP: -68/372\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Snorlax fainted!\",\n   \"pokemon1HPLost\": -372,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Snorlax HP: 0/372\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "{   \"pokemon1\":{      \"trainer\":\"Red\",      \"name\":\"chansey\",      \"type\":\"normal\",      \"level\":100,      \"stats\":{         \"hp\":704,         \"attack\":50,         \"defense\":46,         \"special-attack\":95,         \"special-defense\":246,         \"speed\":136      }   },   \"pokemon2\":{      \"trainer\":\"Blue\",      \"name\":\"chansey\",      \"type\":\"normal\",      \"level\":100,      \"stats\":{         \"hp\":704,         \"attack\":50,         \"defense\":46,         \"special-attack\":95,         \"special-defense\":246,         \"speed\":136      }   }}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": \"Player B\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 449/704\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 449/704\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Player A's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 140,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 589/704\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 589/704\"\n  },\n  {\n   \"turn\": 5,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 334/704\"\n  },\n  {\n   \"turn\": 6,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 194/704\"\n  },\n  {\n   \"turn\": 7,\n   \"action\": \"Player A's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 140,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 334/704\"\n  },\n  {\n   \"turn\": 8,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 474/704\"\n  },\n  {\n   \"turn\": 9,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 219/704\"\n  },\n  {\n   \"turn\": 10,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: -61/704\"\n  },\n  {\n   \"turn\": 10,\n   \"action\": \"A's Chansey fainted!\",\n   \"pokemon1HPLost\": -704,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 0/704\"\n  }\n ]\n}\n```" }],
      },
      {
        role: "user",
        parts: [{ text: "{   \"pokemon1\":{      \"trainer\":\"Red\",      \"name\":\"chansey\",      \"type\":\"normal\",      \"level\":100,      \"stats\":{         \"hp\":704,         \"attack\":50,         \"defense\":46,         \"special-attack\":95,         \"special-defense\":246,         \"speed\":136      }   },   \"pokemon2\":{      \"trainer\":\"Blue\",      \"name\":\"chansey\",      \"type\":\"normal\",      \"level\":100,      \"stats\":{         \"hp\":704,         \"attack\":50,         \"defense\":46,         \"special-attack\":95,         \"special-defense\":246,         \"speed\":136      }   }}" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n \"winner\": null,\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 449/704\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 449/704\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Player A's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 140,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 589/704\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 589/704\"\n  },\n  {\n   \"turn\": 5,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 334/704\"\n  },\n  {\n   \"turn\": 6,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 194/704\"\n  },\n  {\n   \"turn\": 7,\n   \"action\": \"Player A's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 140,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 334/704\"\n  },\n  {\n   \"turn\": 8,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 474/704\"\n  },\n  {\n   \"turn\": 9,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 219/704\"\n  },\n  {\n   \"turn\": 10,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: -61/704\"\n  },\n  {\n   \"turn\": 11,\n   \"action\": \"Player A's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 140,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 129/704\"\n  },\n  {\n   \"turn\": 12,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 614/704\"\n  },\n  {\n   \"turn\": 13,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 359/704\"\n  },\n  {\n   \"turn\": 14,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: -126/704\"\n  },\n  {\n   \"turn\": 14,\n   \"action\": \"A's Chansey fainted!\",\n   \"pokemon1HPLost\": -704,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 0/704\"\n  },\n  {\n   \"turn\": 15,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 754/704\"\n  },\n  {\n   \"turn\": 16,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 499/704\"\n  },\n  {\n   \"turn\": 17,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: -381/704\"\n  },\n  {\n   \"turn\": 18,\n   \"action\": \"A's Chansey fainted!\",\n   \"pokemon1HPLost\": -704,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 0/704\"\n  },\n  {\n   \"turn\": 19,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 639/704\"\n  },\n  {\n   \"turn\": 20,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -255,\n   \"result\": \"B's Chansey HP: 384/704\"\n  },\n  {\n   \"turn\": 21,\n   \"action\": \"Player B's Chansey used Seismic Toss on Player A's Chansey!\",\n   \"pokemon1HPLost\": -255,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: -636/704\"\n  },\n  {\n   \"turn\": 22,\n   \"action\": \"A's Chansey fainted!\",\n   \"pokemon1HPLost\": -704,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"A's Chansey HP: 0/704\"\n  },\n  {\n   \"turn\": 23,\n   \"action\": \"Player B's Chansey used Soft-Boiled!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 140,\n   \"result\": \"B's Chansey HP: 524/704\"\n  },\n  {\n   \"turn\": 24,\n   \"action\": \"Player A's Chansey used Seismic Toss on Player B's Chansey!\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -25" }],
      },
    ],
  });

  const result = await chat.sendMessage(JSON.stringify(input));
  const response = result.response;

  return response.text()
}

module.exports = { geminiGenerateResponse };