import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {

  const [name, setName] = useState('');
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('ws://backend-pobvgj2xoq-uc.a.run.app');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const changeState = (msg) => {
    setData((prevData) => [...prevData, msg]);
  }

  useEffect(() => {
    if (socket) {
      const handleHello = (arg) => {
        changeState(arg);
      }

      socket.on("message", handleHello);

      return () => {
        socket.off("message", handleHello);
      };
    }
  }, [socket])

  const sendMsg = () => {

    if(!name) return;

    socket.emit("message", `${name}: ${msg}`);
    setMsg('');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input className='input' type="text" placeholder='enter your name' value={name} onChange={(e) => setName(e.target.value)}/>
        <p>
          <input className='input' type="text" placeholder='type something..' value={msg} onChange={(e) => setMsg(e.target.value)}/>
          <button className='btn' onClick={sendMsg}>send</button>
        </p>
        <div
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {
            data.map((el, idx) => (
              <div key={idx}>{ el }</div>
            ))
          }
        </div>
      </header>
    </div>
  );
}

export default App;
