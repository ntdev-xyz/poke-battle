import MessageBar from "./messageBar"

function RoomFooter() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 text-white">
            <MessageBar />
        </div>
    )
}

export default RoomFooter