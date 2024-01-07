import { socket } from '@/server/socket';
import router from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import PokemonCard from '@/app/components/pokemonCard';
import { Container, Flex } from '@radix-ui/themes';
import Image from 'next/image'
import { motion } from 'framer-motion';

function Battle(): React.ReactElement {

    const [clientSocket, setClientSocket] = useState(socket)
    const [isLoading, setIsLoading] = useState(true)
    const [pokemons, setPokemons] = useState({
        pokemons: [
            {
                "name": "pikachu",
                "stats": [
                    {
                        "name": "hp",
                        "baseStat": 50
                    },
                ],
                "types": [
                    {
                        "name": "electric"
                    }
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
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

    return (
        <>
            <Flex gap="3" direction="column">
                {pokemons?.pokemons.map(pokemonData => {
                    return (
                        <PokemonCard data={pokemonData} />
                    )
                })}
            </Flex>
        </>
    )
}

export default Battle