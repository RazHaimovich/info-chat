import { useEffect } from 'react';
import { io } from "socket.io-client";
import Chat from './components/Chat/Chat';
import Footer from './components/Footer/Footer';
import './App.scss';

const SERVER = process.env.REACT_APP_SERVER || "http://localhost:4000/";
export const socket = io(SERVER);

function App() {
  useEffect(() => {
    return () => socket.close();
  });

  return (
    <div className="main">
      <Chat />
      <Footer />
    </div>
  );
}

export default App;
