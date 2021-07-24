import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'

import axios from 'axios';
import Pusher from 'pusher-js';
import {useEffect, useState} from 'react';


export default function Home() {

  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      const pusher = new Pusher('cfc42716c0b45b395239', {
        cluster: 'us2'
      });

      const channel = pusher.subscribe('chat');
      channel.bind('message', function(data) {
        const allMessages = [...messages];
        allMessages.push(data);
        setMessages(allMessages);
      });
  })

  const submit = async (event) => {
    event.preventDefault();

    await axios({
        url: "http://localhost:8080/api/messages",
        method: "POST",
        data: {username, message}
    });

    setMessage('');
  };

  return (
    <div className="container">
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"/>
      </Head>

      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" >
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
          <input className="fs-5 fw-semibold" placeholder="username" value={username} onChange={event => setUsername(event.target.value)}/>
        </div>
        <div className="list-group list-group-flush border-bottom scrollarea" style={{minHeight: "500px"}}>
            {messages.map(message => (
              <div key={message.id} hclassName="list-group-item list-group-item-action py-3 lh-tight">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{message.username}</strong>
                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </div>
            ))}
        </div>

        <form onSubmit={submit} >
            <input className="form-control" placeholder="write message" value={message} onChange={event => setMessage(event.target.value)} />
        </form>
    </div>
  </div>
  )
}
