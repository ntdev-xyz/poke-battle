import { socket } from '@/server/socket';
import router from 'next/router';
import { useEffect, useState } from 'react';
import PokemonCard from '@/app/components/pokemonCard';
import { Container, Flex, Text, Grid } from '@radix-ui/themes';
import Image from 'next/image'
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import '@/styles/battle.css';
import { Pokemon } from '@/utils/types';

function Battle(): React.ReactElement {

    const [clientSocket, setClientSocket] = useState(socket)
    const [isLoading, setIsLoading] = useState(true)
    const [room, setRoom] = useState<string>()
    const [awaitingServer, setAwaitingServer] = useState<boolean>(false)
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon>()
    const [rivalPokemon, setRivalPokemon] = useState<Pokemon>()
    const [pokemons, setPokemons] = useState<{ pokemons: Pokemon[] }>({ pokemons: [] })
    const [isFainted, setIsFainted] = useState(false)

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
            setAwaitingServer(true);
        })

        socket.on('battleOutcome', (outcome) => {
            // setAwaitingServer(false);
        })

        socket.on('battleFinish', ({ pokemons, winner }: {pokemons: Pokemon[], winner: boolean}) => {
            console.log({ pokemons, winner })
            setAwaitingServer(false);
            setPokemons({pokemons})

            !winner && setIsFainted(true)
        })

        socket.on('setRivalPokemon', (pokemon: Pokemon) => {
            setRivalPokemon(pokemon)
            console.log(`Rival Pokemon: ${pokemon.name}`)
        })

        return () => {
            // Clean up event listeners when component unmounts
            socket.off('pokemonData');
            socket.off('subscribedTo');
            socket.off('battleInitiated');
            socket.off('battleOutcome');
            socket.off('setRivalPokemon');
            socket.off('battleFinish');
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

    const handleSelectedPokemon = (pokemon: Pokemon) => {
        if (awaitingServer) {
            return
        }

/* 
        console.log({ isFainted })
        setPokemons((prev) => {
            const updatedPokemons = prev.pokemons.map((p) =>
                p.name === pokemon.name
                    ? {
                        ...p,
                        stats: [{ name: p.stats[0].name, stat: remainingHp === -1 ? p.stats[0].stat : remainingHp }, ...p.stats.slice(1)],
                        isFainted: isFainted,
                    }
                    : p
            );
            console.log({updatedPokemons})
            return { pokemons: updatedPokemons };
        }); */
        setChosenPokemon(pokemon)
        console.log(`selected: ${pokemon.name}`)
        socket.emit("selectedPokemon", { pokemon, room })
    }

    const VersusAnimatedImage = () => {
        const controls = useAnimation();

        // Animation sequence
        const animateSequence = async () => {
            await new Promise(resolve => setTimeout(resolve, 4000));
            // Soft spring motion
            await controls.start({ scale: 1.2, opacity: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } });

            // Rotate animation
            await controls.start({ scale: 1.7, rotate: [0, 359], transition: { duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } });

        }

        // Trigger animation on mount
        useEffect(() => {
            animateSequence();
        }, []); // Run the animation sequence once on mount

        return (
            <motion.div animate={controls} initial={{ scale: 0.1, opacity: 0 }}>
                <Image src="/pokeball2.svg"
                    alt="versus"
                    width={100}
                    height={24}
                    priority />
            </motion.div>
        )

    }

    const PlayerAnimatedPokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
        const controls = useAnimation();

        // Animation sequence
        const animateSequence = async () => {

            // Step 1: Soft spring motion
            await controls.start({ scale: 1.2, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 200 } });

            // Step 2: Move to the left
            await controls.start({ x: "-50%", transition: { duration: 0.5 } });

            // Step 3: Another component appears on the right
            // Add additional animation steps as needed

            // For example, you can add a third animation step here
            // await controls.start({ opacity: 0.5, x: "50%", transition: { duration: 0.5 } });
        };

        // Trigger animation on mount
        useEffect(() => {
            animateSequence();
        }, []); // Run the animation sequence once on mount

        return (
            <div className="z-[999]">
                <motion.div className="zIndex" initial={{ scale: 0.8, opacity: 0 }} animate={controls}>
                    <PokemonCard key={pokemon.name} data={pokemon} callback={() => { }} />
                    {/* Add the second component or additional components here */}
                    {/* <AnotherComponent key={anotherComponentData.name} data={anotherComponentData} /> */}
                </motion.div>
            </div>
        );
    };

    const RivalAnimatedPokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
        const controls = useAnimation();

        // Animation sequence
        const animateSequence = async () => {

            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 1: Soft spring motion
            await controls.start({ scale: 1.2, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 200 } });

            // Step 2: Move to the left
            await controls.start({ x: "+50%", transition: { duration: 0.5 } });

            // Step 3: Another component appears on the right
            // Add additional animation steps as needed

            // For example, you can add a third animation step here
            // await controls.start({ opacity: 0.5, x: "50%", transition: { duration: 0.5 } });
        };

        // Trigger animation on mount
        useEffect(() => {
            animateSequence();
        }, []); // Run the animation sequence once on mount

        return (
            <div className="z-[999]">
                <motion.div className="zIndex" initial={{ scale: 0.8, opacity: 0 }} animate={controls}>
                    <PokemonCard key={pokemon.name} data={pokemon} callback={() => { }} isStatic={true} />
                    {/* Add the second component or additional components here */}
                    {/* <AnotherComponent key={anotherComponentData.name} data={anotherComponentData} /> */}
                </motion.div>
            </div>
        );
    };

    return (
        <Grid
            columns={{
                initial: "1",
                sm: "1",
                md: "2",
                lg: "3",
                xl: "3",
            }}
            gap="3"
        >
            <AnimatePresence>
                {awaitingServer && (
                    <motion.div
                        key="loading-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="overlay"
                    >
                        {chosenPokemon && rivalPokemon && (
                            <>
                                <PlayerAnimatedPokemonCard pokemon={chosenPokemon} />
                                <VersusAnimatedImage />
                                <RivalAnimatedPokemonCard pokemon={rivalPokemon} />
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <Flex gap="3">
                {pokemons?.pokemons.map((pokemonData) => (
                    <AnimatePresence key={pokemonData.name}>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0 }}
                            variants={{
                                visible: { opacity: 1, scale: 1 },
                                hidden: { opacity: 0, scale: 0 },
                            }}
                            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                        >

                            <PokemonCard key={pokemonData.name} data={pokemonData} callback={handleSelectedPokemon} isWaiting={awaitingServer} />
                        </motion.div>
                    </AnimatePresence>
                ))}

            </Flex>
        </Grid>
    )
}

export default Battle