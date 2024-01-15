import { socket } from '@/server/socket';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import PokemonCard from '@/app/components/pokemonCard';
import { Container, Flex, Text, Grid, Heading, Box } from '@radix-ui/themes';
import Image from 'next/image'
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Pokemon } from '@/utils/types';
import Lottie from "lottie-react";
import squirtle from '@/lotties/squirtle.json'
import '@/pages/styles/battle.css';
import BattlePanelDrawer from '@/app/components/battlePanelDrawer';

function Battle(): React.ReactElement {

    const [clientSocket, setClientSocket] = useState(socket)
    const [isLoading, setIsLoading] = useState(true)
    const [room, setRoom] = useState<string>()
    const [awaitingServer, setAwaitingServer] = useState<boolean>(false)
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon>()
    const [rivalPokemon, setRivalPokemon] = useState<Pokemon>()
    const [pokemons, setPokemons] = useState<{ pokemons: Pokemon[] }>({ pokemons: [] })
    const [rivalData, setRivalData] = useState<{ trainer: string, pokemons: Pokemon[] }>({ trainer: "", pokemons: [] })
    const [isFainted, setIsFainted] = useState(false)
    const [winner, setWinner] = useState('')

    const updateRivalData = (pokemon: Pokemon) => {
        setRivalData((prevRivalData) => {
            const updatedPokemons = [...prevRivalData.pokemons];
            
            // Find the position based on name
            const indexToUpdateByName = updatedPokemons.findIndex((prevPokemon) => prevPokemon?.name === pokemon.name);
    
            if (indexToUpdateByName !== -1) {
                // If a position based on name is found, update it
                updatedPokemons[indexToUpdateByName] = pokemon;
            } else {
                // If no position based on name, find the first null position and update it
                const indexToUpdate = updatedPokemons.findIndex((prevPokemon) => prevPokemon === null);
    
                if (indexToUpdate !== -1) {
                    updatedPokemons[indexToUpdate] = pokemon;
                }
            }
    
            return {
                trainer: prevRivalData.trainer,
                pokemons: updatedPokemons,
            };
        });
    };

    useEffect(() => {
        // back to room if disconnected
        !socket.connected && router.push('/room')

        socket.on('pokemonData', (pokemons) => {
            setPokemons(pokemons)
            setIsLoading(false)
            console.log(pokemons)
        });

        socket.on('rivalData', (pokemons) => {
            setRivalData(pokemons)
            console.log({ pokemons })
        });

        socket.on('rivalUpdateData', (pokemon) => {
            updateRivalData(pokemon);
            console.log('rival update')
            console.log({ pokemon })
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

        socket.on('battleFinish', ({ pokemons, winner }: { pokemons: Pokemon[], winner: boolean }) => {
            console.log({ pokemons, winner })
            setAwaitingServer(false);
            setPokemons({ pokemons })

            !winner && setIsFainted(true)
        })

        socket.on('setRivalPokemon', (pokemon: Pokemon) => {
            setRivalPokemon(pokemon)
            // Update rivalData state
            updateRivalData(pokemon);
            console.log(`Rival Pokemon: ${pokemon.name}`)
        })

        socket.on('finish', ({ winner }: { winner: string }) => {
            console.log(winner)
            setWinner(winner)
        })

        socket.on('endMatch', () => {
            console.log('Match ending in 10 seconds...')
            socket.disconnect()
            router.push('/room')
        })

        socket.on('rivalDisconnection', (message) => {
            console.log(message)
            setTimeout(() => {
                socket.disconnect()
                router.push('/room')
            }, 1000)
        })

        return () => {
            // Clean up event listeners when component unmounts
            socket.off('pokemonData');
            socket.off('rivalData');
            socket.off('rivalUpdateData');
            socket.off('subscribedTo');
            socket.off('battleInitiated');
            socket.off('battleOutcome');
            socket.off('setRivalPokemon');
            socket.off('battleFinish');
            socket.off('finish');
            socket.off('endMatch');
            socket.off('rivalDisconnection')
            console.log('Socket event listeners removed');
        };

    }, [])

    if (!socket.connected) {
        return <></>
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Lottie animationData={squirtle} />
                {/*                 <motion.div
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
                </motion.div> */}
            </div>
        );
    }

    const handleSelectedPokemon = (pokemon: Pokemon) => {
        if (awaitingServer) {
            return
        }
        setChosenPokemon(pokemon)
        console.log(`selected: ${pokemon.name}`)
        socket.emit("selectedPokemon", { pokemon, room })
    }

    const VersusAnimatedImage = () => {
        const controls = useAnimation();
        const isMounted = useRef(true);

        // Animation sequence
        const animateSequence = async () => {
            if (isMounted.current) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                // Soft spring motion
                await controls.start({
                    scale: 1.2,
                    opacity: 1,
                    transition: { duration: 0.2, type: 'spring', stiffness: 200 }
                });

                // Rotate animation
                await controls.start({
                    scale: 1.7,
                    rotate: [0, 359],
                    transition: { duration: 0.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
                });
            }
        }

        // Trigger animation on mount
        useEffect(() => {
            animateSequence();

            return () => {
                controls.stop()
                isMounted.current = false
            }
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
        const isMounted = useRef(true);

        // Animation sequence
        const animateSequence = async () => {

            if (isMounted.current) {
                // Step 1: Soft spring motion
                await controls.start({
                    scale: 1.2,
                    opacity: 1,
                    transition: {
                        duration: 0.3, type: "spring", stiffness: 200
                    }
                });

                // Step 2: Move to the left
                await controls.start({
                    x: "-50%",
                    transition: { duration: 0.3 }
                });
            }
        };

        // Trigger animation on mount
        useEffect(() => {
            animateSequence();

            return () => {
                controls.stop()
                isMounted.current = false
            }
        }, []); // Run the animation sequence once on mount

        return (
            <div className="z-[999]">
                <motion.div className="zIndex" initial={{ scale: 0.8, opacity: 0 }} animate={controls}>
                    <PokemonCard key={pokemon.name} data={pokemon} callback={() => { }} />
                </motion.div>
            </div>
        );
    };

    const RivalAnimatedPokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
        const controls = useAnimation();
        const isMounted = useRef(true);

        // Animation sequence
        const animateSequence = async () => {

            if (isMounted.current) {
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Step 1: Soft spring motion
                await controls.start({
                    scale: 1.2,
                    opacity: 1,
                    transition: { duration: 0.3, type: "spring", stiffness: 200 }
                });

                // Step 2: Move to the left
                await controls.start({
                    x: "+50%",
                    transition: { duration: 0.3 }
                });
            }
        };

        // Trigger animation on mount
        useEffect(() => {
            animateSequence();

            return () => {
                controls.stop()
                isMounted.current = false
            }
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
        <>
            <BattlePanelDrawer rivalData={rivalData} />
            <Grid
                columns={{
                    initial: "1",
                    sm: "2",
                    md: "3",
                }}
                height="auto"
                gap="3"

            >{winner != '' &&
                <AnimatePresence>
                    <motion.div
                        className="giant-message-container overlay"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 3, ease: 'easeInOut' }}
                    >
                        <Heading size="9" weight="bold">{socket.id == winner ? 'VICTORY'
                            : winner == 'draw' ?
                                'DRAW' : 'DEFEAT'}
                        </Heading>
                    </motion.div>
                </AnimatePresence>}
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

                {/* <Flex gap="3"> */}

                {pokemons?.pokemons.map((pokemonData) => (
                    <Box width="100%" height="100%">
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
                    </Box>
                ))}


                {/* </Flex> */}
            </Grid>
        </>
    )
}

export default Battle