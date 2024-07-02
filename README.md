# Poke Battle

Poke Battle is a real-time web application that allows users to join a queue and battle each other in a Pokémon-style game. This project focuses on server-client communication and real-time interactions, with battle outcomes determined using Google’s Gemini AI.

## Features

- **Queue System:** Users join a queue and are matched with the next available opponent.
- **Real-Time Battles:** Users battle each other in real-time.
- **State Management:** Efficient handling of game states and user synchronization using Redux and Context API.
- **AI Battle Outcomes:** Battle outcomes are determined using Google’s Gemini AI.

## Technologies Used

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io for real-time communication
- **State Management:** Redux, Context API
- **Styling:** Tailwind CSS
- **AI Integration:** Google’s Gemini AI

## Getting Started

### Prerequisites

- Node.js and npm installed
- Gemini API Key (or just implement another model)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ntdev-xyz/poke-battle.git
    cd poke-battle
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the frontend server:

    ```sh
    npm run dev
    ```
    
4. Start the backend server:
    ```sh
    npm run server
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Joining a Queue:** Users can join the queue from the main interface.
2. **Battling:** Once matched, users will enter a battle scene where they can compete in real-time.
3. **Real-Time Updates:** Game states and user interactions are synchronized in real-time using Socket.io.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by classic Pokémon games.
- Special thanks to the open-source community for various libraries and tools used.
- Battle outcomes powered by Google’s Gemini AI (You'll need a key for that, or just use another AI model).
