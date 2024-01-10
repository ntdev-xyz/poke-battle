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


  console.log(JSON.stringify(input))
/*   const parts = [
    { text: "Simulate an official Pokemon battle. Will return the winner of the battle and the remaining HP of the winner. Remaining HP should not be greater than the provided HP. The pokemons could be the same, so provide which player has won. Use the JSON format given below. " + outputFormat},
    { text: JSON.stringify(input) },  // Add the new input JSON here
  ]; */

  const parts = [
    {text: "Pokemon battle based on stats. Will return the winner of the battle and the remaining HP in JSON format. Remaining HP should not be greater than the provided HP."},
    {text: "Simulate an official Pokemon battle. Will return the winner of the battle and the remaining HP of the winner. Remaining HP should not be greater than the provided HP. Remaining HP must match the provided HP minus HP lost in the battle log. The pokemons could be the same, so provide which player has won. The return is a JSON format given below. \n{\n \"winner\": \"Nelson\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Nelson's Bellossom used Razor Leaf.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -20,\n   \"result\": \"Shuppet lost 20 HP.\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Gabriel's Shuppet used Shadow Sneak.\",\n   \"pokemon1HPLost\": -30,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom lost 30 HP.\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Nelson's Bellossom used Solar Beam.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -40,\n   \"result\": \"Shuppet lost 40 HP.\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Gabriel's Shuppet used Confuse Ray.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom is now confused.\"\n  },\n  {\n   \"turn\": 5,\n   \"action\": \"Bellossom used Petal Dance in its confusion.\",\n   \"pokemon1HPLost\": -20,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom lost 20 HP.\"\n  },\n  {\n   \"turn\": 6,\n   \"action\": \"Nelson's Bellossom used Giga Drain.\",\n   \"pokemon1HPLost\": 30,\n   \"pokemon2HPLost\": -30,\n   \"result\": \"Bellossom regained 30 HP. Shuppet lost 30 HP.\"\n  },\n  {\n   \"turn\": 7,\n   \"action\": \"Gabriel's Shuppet used Shadow Claw.\",\n   \"pokemon1HPLost\": -25,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom lost 25 HP.\"\n  },\n  {\n   \"turn\": 8,\n   \"action\": \"Nelson's Bellossom used Sleep Powder.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Shuppet is now asleep.\"\n  },\n  {\n   \"turn\": 9,\n   \"action\": \"Nelson's Bellossom used Petal Blizzard.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -45,\n   \"result\": \"Shuppet lost 45 HP.\"\n  },\n  {\n   \"turn\": 10,\n   \"action\": \"Shuppet woke up.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Shuppet is no longer asleep.\"\n  },\n  {\n   \"turn\": 11,\n   \"action\": \"Gabriel's Shuppet used Curse.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Shuppet's attack and defense increased, but its speed decreased.\"\n  },\n  {\n   \"turn\": 12,\n   \"action\": \"Nelson's Bellossom used Sunny Day.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"The sunlight intensified, boosting Bellossom's Solar Beam power.\"\n  },\n  {\n   \"turn\": 13,\n   \"action\": \"Nelson's Bellossom used Solar Beam.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -50,\n   \"result\": \"Shuppet lost 50 HP and fainted.\"\n  }\n ]\n}"},
    {text: "{\"pokemon1\":{\"trainer\":\"Nelson\",\"name\":\"bellossom\",\"type\":\"Grass\",\"level\":50,\"stats\":{\"hp\":200,\"attack\":100,\"defense\":131,\"special-attack\":105,\"special-defense\":118,\"speed\":72}},\"pokemon2\":{\"trainer\":\"Gabriel\",\"name\":\"shuppet\",\"type\":\"Ghost\",\"level\":50,\"stats\":{\"hp\":141,\"attack\":88,\"defense\":49,\"special-attack\":73,\"special-defense\":43,\"speed\":63}}}"},
    {text: "{\n \"winner\": \"Nelson\",\n \"battleLog\": [\n  {\n   \"turn\": 1,\n   \"action\": \"Nelson's Bellossom used Razor Leaf.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -20,\n   \"result\": \"Shuppet lost 20 HP.\"\n  },\n  {\n   \"turn\": 2,\n   \"action\": \"Gabriel's Shuppet used Shadow Sneak.\",\n   \"pokemon1HPLost\": -30,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom lost 30 HP.\"\n  },\n  {\n   \"turn\": 3,\n   \"action\": \"Nelson's Bellossom used Solar Beam.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -40,\n   \"result\": \"Shuppet lost 40 HP.\"\n  },\n  {\n   \"turn\": 4,\n   \"action\": \"Gabriel's Shuppet used Confuse Ray.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom is now confused.\"\n  },\n  {\n   \"turn\": 5,\n   \"action\": \"Bellossom used Petal Dance in its confusion.\",\n   \"pokemon1HPLost\": -20,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom lost 20 HP.\"\n  },\n  {\n   \"turn\": 6,\n   \"action\": \"Nelson's Bellossom used Giga Drain.\",\n   \"pokemon1HPLost\": 30,\n   \"pokemon2HPLost\": -30,\n   \"result\": \"Bellossom regained 30 HP. Shuppet lost 30 HP.\"\n  },\n  {\n   \"turn\": 7,\n   \"action\": \"Gabriel's Shuppet used Shadow Claw.\",\n   \"pokemon1HPLost\": -25,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Bellossom lost 25 HP.\"\n  },\n  {\n   \"turn\": 8,\n   \"action\": \"Nelson's Bellossom used Sleep Powder.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Shuppet is now asleep.\"\n  },\n  {\n   \"turn\": 9,\n   \"action\": \"Nelson's Bellossom used Petal Blizzard.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -45,\n   \"result\": \"Shuppet lost 45 HP.\"\n  },\n  {\n   \"turn\": 10,\n   \"action\": \"Shuppet woke up.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Shuppet is no longer asleep.\"\n  },\n  {\n   \"turn\": 11,\n   \"action\": \"Gabriel's Shuppet used Curse.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"Shuppet's attack and defense increased, but its speed decreased.\"\n  },\n  {\n   \"turn\": 12,\n   \"action\": \"Nelson's Bellossom used Sunny Day.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": 0,\n   \"result\": \"The sunlight intensified, boosting Bellossom's Solar Beam power.\"\n  },\n  {\n   \"turn\": 13,\n   \"action\": \"Nelson's Bellossom used Solar Beam.\",\n   \"pokemon1HPLost\": 0,\n   \"pokemon2HPLost\": -50,\n   \"result\": \"Shuppet lost 50 HP and fainted.\"\n  }\n ]\n}"},
    {text: JSON.stringify(input)},
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  console.log(response.text());

  return response
  }
  
  module.exports = { geminiGenerateResponse };