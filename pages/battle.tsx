import { socket } from '@/server/socket';
import router from 'next/router';
import { useEffect, useState } from 'react';
import PokemonCard from '@/app/components/pokemonCard';
import { Container, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';
import './styles/battle.css';

function Battle(): React.ReactElement {

    const [clientSocket, setClientSocket] = useState(socket)
    const [isLoading, setIsLoading] = useState(true)
    const [room, setRoom] = useState()
    const [awaitingServer, setAwaitingServer] = useState(false)
    const [pokemons, setPokemons] = useState({
        pokemons: [
            {
                "name": "pikachu",
                "baseStats": [
                    {
                        "name": "hp",
                        "baseStat": 50
                    },
                ],
                "stats": [
                    {
                        "name": "hp",
                        "stat": 50
                    },
                ],
                "types": [
                    {
                        "name": "electric"
                    }
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
                "imageShiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png",
                "level": 1,
                "isShiny": true
            },
        ]
    })

    useEffect(() => {
        // back to room if disconnected
        !socket.connected && router.push('/room')

        socket.on('pokemonData', (pokemons) => {
            setPokemons(pokemons)
            setIsLoading(false)
            console.log(pokemons)
        });

        socket.on('subscribedTo', (room) => {
            setRoom(room)
            console.log(`Subscribed to ${room}`)
        })

        socket.on('battleInitiated', (data) => {
            setAwaitingServer(true)
            console.log('Server initiated battle');
            console.log('Current state (before update):', { awaitingServer });
            setAwaitingServer(true);
            console.log('Current state (after update):', { awaitingServer });
        })

        socket.on('battleOutcome', (outcome) => {
            console.log('Battle outcome received:', outcome);
            console.log('Current state (before update):', { awaitingServer });
            setAwaitingServer(false);
            console.log('Current state (after update):', { awaitingServer });
        })

        console.log({awaitingServer})

        return () => {
            // Clean up event listeners when component unmounts
            socket.off('pokemonData');
            socket.off('subscribedTo');
            socket.off('battleInitiated');
            socket.off('battleOutcome');
            console.log('Socket event listeners removed');
        };

    }, [])

    if (!socket.connected) {
        return <></>
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <motion.div
                    initial={{ y: 0 }}
                    animate={{
                        y: 0,
                        rotate: [0, 359], // Animate from 0 to 360 degrees
                    }}
                    exit={{ y: 0 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                >
                    <Image
                        src="/pokeball2.svg"
                        alt="Pokeball"
                        width={100}
                        height={24}
                        priority
                    />
                </motion.div>
            </div>
        );
    }

    const handleSelectedPokemon = (pokemon: any) => {
        console.log(`selected: ${pokemon.name}`)
        socket.emit("selectedPokemon", { pokemon, room })
    }

    return (
        <Container>
            {/* <AnimatePresence> */}
                    <motion.div
                        key="loading-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="overlay"
                    >
                        <motion.div className="loader" />
                    </motion.div>
            {/* </AnimatePresence> */}
            <Flex gap="3">
                <Text>{awaitingServer}</Text>
                {pokemons?.pokemons.map(pokemonData => {
                    return (
                        <PokemonCard key={pokemonData.name} data={pokemonData} callback={handleSelectedPokemon} />
                    )
                })}
            </Flex>
        </Container>
    )
}

export default Battle