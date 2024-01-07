import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { socket } from '@/server/socket';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux';
import { addMessage } from '@/app/hooks/messagesSlice';
import RoomLayout from '@/app/components/roomLayout';
import ButtonConnect from '@/app/components/buttonConnect'
import { TextField, Button, TextFieldInput, Flex, Card } from '@radix-ui/themes';
import * as Toast from '@radix-ui/react-toast';
import './styles/room.css';

interface toast {
  type: "error" | "alert" | "notification" | "",
  title: string,
  message: string,
  action: string,
}

const Room = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<toast>({
    type: "",
    title: "",
    message: "",
    action: "",
  });
  const router = useRouter(); // Add this line to get the router object

  const dispatch = useAppDispatch();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
 

    // Listen for the linkClients event
    socket.on('linkClients', (data) => {
      console.log(data.message);
      dispatch(addMessage(data.message + ' Entering battle...'));

      // Handle the linked connection here
      // dispatch(addMessage('Entering battle in 3 seconds...'));

      const redirectTimeout = setTimeout(() => {
        // Redirect to the new URL after 3 seconds
        router.push('/battle'); // Change 'your-new-page' to the desired page
      }, 500);

      return () => clearTimeout(redirectTimeout);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      //   socket.disconnect();
    };
  }, [router]); // Add router to the dependency array

  const handleConnect = () => {
    if (name === '' && !isConnected) {
      setOpen(false)
      setToast(prev => {
        return {
          ...prev,
          type: "error",
          message: "Informe o usuário antes de conectar"
        }
      })
      setOpen(true)
      return;
    }
    if (isConnected) {
      socket.disconnect();
      dispatch(addMessage('Disconnected from the server...'));
      return;
    }

    socket.connect();
    socket.emit('setUsername', name);
  };

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (

    <RoomLayout>
      <Card className="w-full flex">
        <div className="flex justify-center items-center p-10">
          <Flex className="w-4/6" gap="3" align="center" direction="column" justify="center">
            <TextField.Root className="w-full">
              <TextField.Input name="name" placeholder="Username..." onChange={handleName}></TextField.Input>
            </TextField.Root>
            <ButtonConnect isConnected={isConnected} handleConnect={handleConnect} />
          </Flex>
        </div>
      </Card>

      <Toast.Provider swipeDirection="right">
        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          {toast.title && <Toast.Title className="ToastTitle">{toast.title}</Toast.Title>}
          <Toast.Description asChild>
            <p>{toast.message}</p>
          </Toast.Description>
          {toast.action && <Toast.Action className="ToastAction" asChild altText={toast.action}>
            <button className="Button small green">{toast.action}</button>
          </Toast.Action>}
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </RoomLayout>

  );
};

export default Room;
