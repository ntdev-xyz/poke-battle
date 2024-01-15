import { Box, Container, Flex, Grid, Text } from "@radix-ui/themes";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { Pokemon } from '@/utils/types';
import HPBar from "./hpBar";
import { capitalizeFirstLetter } from "@/utils/stringFunctions";

function BattlePanelDrawer({ rivalData }: { rivalData: { trainer: string, pokemons: Pokemon[] } }) {
    const [isOpen, setIsOpen] = useState(false);
    const controlsDrawer = useAnimation();
    const controlsContent = useAnimation();

    const openDrawer = () => {
        setIsOpen(true);
        controlsDrawer.start({ height: "50vh" });
        controlsContent.start({ display: "block" });
    };

    const closeDrawer = () => {
        setIsOpen(false);
        controlsDrawer.start({ height: "0vh" });
        controlsContent.start({ display: "none" });
    };

    const rivalImage = (trainer: string) => {
        switch (trainer) {
            case 'Red':
                return '/FireRed_LeafGreen_Red.png'
            case 'Blue':
                return '/FireRed_LeafGreen_Blue.png'
            case 'Leaf':
                return '/FireRed_LeafGreen_Leaf.png'
            case 'May':
                return '/Omega_Ruby_Alpha_Sapphire_May.png'
            case 'Ethan':
                return '/HeartGold_SoulSilver_Ethan.png'
            case 'Silver':
                return '/HeartGold_SoulSilver_Silver.png'
            default:
                return ''
        }
    }

    return (
        <>
            <div className="fixed z-10 top-0 right-0 left-0 h-0 border-solid border-2 border-black bg-gray-100 bg-opacity-80">
                <motion.div
                    id="battle-content"
                    className="h-[0vh] bg-inherit"
                    animate={controlsDrawer}
                >
                    <Container>
                        <motion.div animate={controlsContent} className="p-2 hidden">
                            <Grid gap="3" columns="2" justify="end" >
                                <Flex direction="column" align="center">
                                    <Box grow="1">
                                        <Image src={rivalImage(rivalData.trainer)}
                                            alt={rivalData.trainer}
                                            width="200"
                                            height="400" />
                                    </Box>
                                </Flex>
                                <Flex direction="column" align="start" justify="center">
                                    {rivalData?.pokemons.map((pokemonData) => (
                                        <>
                                            <Flex direction="row" justify="center" align="center" position="relative" gap="2">
                                                <Box className="w-[5vh]">
                                                    <Image src="/pokeball2.svg" alt="pokeball" width="40" height="20" />
                                                </Box>
                                                {!pokemonData?.name ?
                                                    <Text>Hidden</Text> :
                                                    <>
                                                        <Box>
                                                            <Text weight="bold">{pokemonData.name.split("-", 99).map(word => { return capitalizeFirstLetter(word) }).join("-")}</Text>
                                                        </Box>
                                                        <Box className="w-[100px]">
                                                            <HPBar stat={pokemonData.stats[0]} totalHp={pokemonData.maxHp} />
                                                        </Box>
                                                    </>
                                                }
                                            </Flex>
                                        </>
                                    ))}
                                </Flex>
                            </Grid>
                        </motion.div>
                    </Container>
                </motion.div>
                <div
                    id="pull-down"
                    className="h-[5vh] rounded-b-lg rounded-ee-full rounded-es-full cursor-pointer bg-inherit"
                    onClick={isOpen ? closeDrawer : openDrawer}
                >
                    <Image src="/doubleArrowDown.svg" alt="double-arrow-down" width="20" height="20" className="top-[50%] left-[50%] relative" />
                </div>
            </div>
        </>
    )
}

export default BattlePanelDrawer