export interface baseStat {
    name: string;
    baseStat: number;
}

export interface Stat {
    name: string;
    stat: number;
}


export interface Type {
    name: string;
}

export interface Pokemon {
    name: string;
    baseStats: baseStat[];
    stats: Stat[];
    types: Type[];
    image: string;
    imageShiny: string;
    level: number;
    isShiny: boolean;
    isFainted?: boolean;
    maxHp: number;
}

export interface PokemonCardProps {
    data: Pokemon;
    callback: Function;
    isStatic?: boolean;
    isWaiting?: boolean;
}

export interface toast {
    type: "error" | "alert" | "notification" | "",
    title: string,
    message: string,
    action: string,
  }