import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Badge, Card, Flex, Text } from '@radix-ui/themes';
import { capitalizeFirstLetter } from '@/utils/stringFunctions';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { StarFilledIcon } from '@radix-ui/react-icons'
import { Type, PokemonCardProps } from '@/utils/types';

const normalizeBaseStat = (stat: string) => {
    switch (stat) {
        case 'baseHp':
            return 'Health'
        case 'baseAttack':
            return 'Attack'
        case 'baseDefense':
            return 'Defense'
        case 'baseSpecialAttack':
            return 'Special Attack'
        case 'baseSpecialDefense':
            return 'Special Defense'
        case 'baseSpeed':
            return 'Speed'
        default:
            return ""
    }
}

const normalizeStat = (stat: string) => {
    switch (stat) {
        case 'hp':
            return 'Health'
        case 'attack':
            return 'Attack'
        case 'defense':
            return 'Defense'
        case 'specialAttack':
            return 'Special Attack'
        case 'specialDefense':
            return 'Special Defense'
        case 'speed':
            return 'Speed'
        default:
            return ""
    }
}

const getTypeColor = (type: string): string => {
    switch (type) {
        case 'normal':
            return '#A8A878';
        case 'fighting':
            return '#C03028';
        case 'flying':
            return '#A890F0';
        case 'poison':
            return '#A040A0';
        case 'ground':
            return '#E0C068';
        case 'rock':
            return '#B8A038';
        case 'bug':
            return '#A8B820';
        case 'ghost':
            return '#705898';
        case 'steel':
            return '#B8B8D0';
        case 'fire':
            return '#F08030';
        case 'water':
            return '#6890F0';
        case 'grass':
            return '#78C850';
        case 'electric':
            return '#F8D030';
        case 'psychic':
            return '#F85888';
        case 'ice':
            return '#98D8D8';
        case 'dragon':
            return '#7038F8';
        case 'dark':
            return '#705848';
        case 'fairy':
            return '#EE99AC';
        case 'unknown':
            return '#68A090';
        case 'shadow':
            return '#705898';
        default:
            return '#FFFFFF'; // Default color
    }
};

const getBackgroundColor = (types: Type[]): string => {
    if (types.length < 2) {
        return getTypeColor(types[0].name);
    }

    return `linear-gradient(110deg, ${getTypeColor(types[0].name)} 50%, ${getTypeColor(types[1].name)} 51%)`;
};

const AnimatedCard = motion(Card);

const PokemonCard: React.FC<PokemonCardProps> = ({ data, callback, isStatic, awaitingServer} ) => {
    const background = getBackgroundColor(data.types);

    const [selected, setSelected] = useState(false)

    const cardVariants = {
        hover:  {
            scale: 1.1,
            zIndex: 2, // Higher z-index when hovered
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
            },
        },
        initial: {
            zIndex: 1, // Default z-index when not hovered
        },
        active: {
            scale: 1.1,
            zIndex: 3,
            boxShadow: "9px 9px 20px 20px #33322b40"
        },        
    };

    const handleCardClick = () => {
        setSelected(!selected);
    };

    const cardRef = useRef<HTMLDivElement | null>(null); // Explicitly

    const handleClickOutside = (event: MouseEvent) => {
        if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
            setSelected(false);
        }
    };

    useEffect(() => {
        if (awaitingServer) {
            setSelected(false)
            return
        }

        if (selected) {
            callback(data)
        } else {
            callback("")
        }


    }, [selected]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <AnimatedCard
            ref={cardRef}
            id={`pokemon-card-${data.name}`}
            style={{ width: 340, 
                padding: 10, 
                background
            }}
            variants={cardVariants}
            whileHover={!isStatic ? "hover" : undefined}
            initial="initial"
            animate={selected ? 'active' : 'initial'}
            onClick={handleCardClick}
            size={{
                initial: "1",
                sm: "1",
                xl: "1"
            }}
        >
            <Text size="3" weight="bold">{capitalizeFirstLetter(data.name.split("-",99)[0])}{data.isShiny && <> <StarFilledIcon color="gold" style={{display: "inline-block"}} /></>}</Text>
            <Flex gap="1" p="2">
                {data.types.map((type) => (
                    <Badge variant="outline" radius="full" style={{ backgroundColor: getTypeColor(type.name) }} key={type.name}>
                        <Text weight="bold" style={{ color: getTypeColor(type.name), filter: "invert(100%)" }}>
                            {capitalizeFirstLetter(type.name)}
                        </Text>
                    </Badge>
                ))}
            </Flex>
            <Card style={{ width: 295, padding: 5 }}>
                <Image src={data.isShiny && data.imageShiny ? data.imageShiny : data.image} alt={data.name} width={290} height={290} />
            </Card>
            {/* <img src={data.image} alt={data.name} style={{ width: '100%', marginBottom: 8 }} /> */}
            <ul className="pt-3">
                {data.stats.map((stat) => (
                    <li className="outline outline-1 rounded-xl mb-2" key={stat.name}>
                        <Flex gap="1" justify="between" pl="3" pr="3">
                            <Text weight="bold">{normalizeStat(stat.name)}</Text>
                            <Text weight="bold">{stat.stat}</Text>
                        </Flex>
                    </li>
                ))}
            </ul>
        </AnimatedCard>
    );
};

export default PokemonCard;