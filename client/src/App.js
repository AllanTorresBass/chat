import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

//Creamos una conección
const socket = io.connect("http://localhost:3001");

function App() {
  //estas variables de estado es para condicionar el renderizado 
  //Estas variables la usamos solo para el funcionamiento de este ejemplo
  let [userType, setUserType] = useState("");
 
  const [showChat, setShowChat] = useState(false);
 
  function handleRadio(e) {
  
    setUserType(e.target.value);
    setShowChat(true);
  }
  ///
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="radio"
            name={userType}
            value="1"
            onClick={handleRadio}
          /> Usario
          <input
           type="radio"
           name={userType}
           value="0"
           onClick={handleRadio}
          />
          Transportista
         
        </div>
      ) : (
        /* enviamos el socket por una props   */
        <Chat socket={socket} userType={userType} />
      )}
    </div>
  );
}

export default App;
