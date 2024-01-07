import { Container } from '@radix-ui/themes';
import '../globals.css'
import RoomFooter from "./roomFooter";

export default function RoomLayout ({children}: {children: React.ReactNode}) {
    return (
        <>
            <main>{children}</main>
            <RoomFooter/>
        </>
    )
}