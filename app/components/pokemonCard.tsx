import React from 'react';
import { Card, Flex } from '@radix-ui/themes';

interface Stat {
    name: string;
    baseStat: number;
}

interface Type {
    name: string;
}

interface Pokemon {
    name: string;
    stats: Stat[];
    types: Type[];
    image: string;
}

interface PokemonCardProps {
    data: Pokemon;
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

const PokemonCard: React.FC<PokemonCardProps> = ({ data }) => {
    const background = getBackgroundColor(data.types);

    return (
        // <Card className="pokemon-card" style={{ width: 200, padding: 16, background }}>
        <Card style={{ width: 200, padding: 16, background }}>
            <h3>{data.name}</h3>
            {data.types.map((type) => (
                <h4 key={type.name}>{type.name}</h4>
            ))}
            <img src={data.image} alt={data.name} style={{ width: '100%', marginBottom: 8 }} />
            <ul>
                {data.stats.map((stat) => (
                    <li key={stat.name}>
                        {stat.name}: {stat.baseStat}
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default PokemonCard;
