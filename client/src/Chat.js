import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, userType}) {
  //disconect esta variable donde vamos a guardar la respuesta del back
  //que nos permitira saber si estan ambos conctados al chat
  const [disconect, setDisconect] = useState("");
  //room: en esta variable guardaremos el id del travel para crear el room del chat
  //y mantenerlo vinculado
  const [room, setRoom] = useState("");
  //currentMessage: aqui se guarda el mensaje actual
  const [currentMessage, setCurrentMessage] = useState("");
  //messageList: se va guardando toda la lista de mensajes
  const [messageList, setMessageList] = useState([]);
  //username: se guardará el usuario actual
  const [username, setUsername] = useState([]);
  
socket.emit("join_room", room, (response) => {
 //aqui estamos envian al back el id del travel para crear el room
 
 //Response.status contiene la respuesta enviada desde el back
 //que en este caso creamos un objeto con todos los datos del travel vinculados
 //con las tablas User y carrier
  console.log(response.status)
  setRoom(response.status.travelId); // ok
  //con la variable userType estamos contralando cual de los usuarios esta desconectado
  //si userType es 1 es usuario conectado es User y el desconectado carrier 
  // y si es 0 lo contraio
      if(userType==='1'){
        setUsername(response.status.Us[0].name)
        setDisconect(response.status.Car[0].name)
      }
      if(userType==='0'){
        setUsername(response.status.Car[0].name)
        setDisconect(response.status.Us[0].name)
      }
  });

  //La funcion sendMessage es la funcion que nos va a permitir enviar los mensajes
  //esta sera usada al momento de darle al boton enviar mensaje
  const sendMessage = async () => {

    if (currentMessage !== "") {
      //messageDate es el objeto que nos permitira agrupar 
      //los datos necesarios para enviar los mensajes
      const messageData = {
        room: room,
        author: username,//agregar nombre de usuario
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
    //en este sockets enviaremos el mensaje al back
      await socket.emit("send_message", messageData, (response) => {
        //este envio nos devolvera una respuesta quenos servira para valiar 
        //si el otro usuario esta conectado y crear la respuesta de usuario offline user
        console.log(response.status);
        if(response.status!==''){ 
          let messageData = {
            room: room,
            author: disconect,//agregar nombre de usuario
            message: response.status,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
          
          setMessageList((list) => [...list, messageData])
        }
        });


      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  //en este useEffect estamos escuchando las respuestas de los 
  //mensaje recibidos que vienen del back
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data)
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
 
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                 /* aqui podemos controlar los estitilos segun el usuario*/
                id={username === messageContent.author || username ===disconect ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        { /* hacemos uso de la funcion sendMessage  */}
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
