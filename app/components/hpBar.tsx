import { Stat } from "@/utils/types";
import * as Progress from '@radix-ui/react-progress';
import { Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

const HPBar = ({ stat, totalHp }: { stat: Stat, totalHp: number }) => {
    const [hp, setHp] = useState<number>(0)
    const [maxHp, setMaxHp] = useState<number>(totalHp)

    useEffect(() => {
        if (stat.stat !== hp) {
            setHp(stat.stat);
        }
    }, [stat.stat, hp])

    return (
        <Flex gap="1" justify="between">
            <Progress.Root className="ProgressRoot" value={hp} max={maxHp}>
                <Progress.Indicator
                    className="ProgressIndicator"
                    style={{ transform: `translateX(-${100 - (hp / maxHp * 100)}%)` }}
                />
            </Progress.Root>
            <Text weight="bold" className="absolute pr-[20px] right-0">{`${hp} / ${maxHp}`}</Text>
        </Flex>
    )
}

export default HPBar