import { Button } from "@radix-ui/themes"
import { motion, AnimatePresence } from "framer-motion"

interface props {
    isConnected: boolean,
    handleConnect: () => void
}

function ButtonConnect(props: props): React.ReactElement {

    const Connect = () => (
        <motion.div
            className="w-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Button size="3" className="w-full" onClick={props.handleConnect}>
                Connect
            </Button>
        </motion.div>
    )

    /*     const Disconnect = () => {
            return (<Button color="crimson" size="3" className="w-full" onClick={props.handleConnect}>Disconnect</Button>)
        } */
    const Disconnect = () => (
        <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Button color="crimson" size="3" className="w-full" onClick={props.handleConnect}>
                Disconnect
            </Button>
        </motion.div>
    )

    return (
        <>
            {props.isConnected ?
                <Disconnect /> :
                <Connect />}
        </>
    )
}

export default ButtonConnect