import { useState } from 'react'
import './App.css'
import axios from 'axios'

const BASE_API_URL = 'http://localhost:3037'

function App() {

  const [OLLAMA_RESPONSE, SET_OLLAMA_RESPONSE] = useState<string>("")
  const [PROMPT, SET_PROMPT] = useState<string>("")
  const [CHAT_HISTORY, SET_CHAT_HISTORY] = useState<{ role: string, content: string }[]>([])
  const [IS_HISTORY_VISIBLE, SET_IS_HISTORY_VISIBLE] = useState<boolean>(false)//


  const HANDLE_BUTTON_CLICK = async () => {
      try {
        const RESPONSE = await axios.post(`${BASE_API_URL}/generate`, { prompt: PROMPT }) // JSON body should be { prompt: PROMPT }
        const MESSAGE = RESPONSE.data.message
        SET_OLLAMA_RESPONSE(MESSAGE)
        SET_CHAT_HISTORY([...CHAT_HISTORY, { role: 'user', content: PROMPT }, { role: 'assistant', content: MESSAGE }])
        SET_PROMPT("")
      } catch (error) {
        console.error('Error making request:', error)
      }
  }

  const HANDLE_BUTTON_HISTORY = async () => {
    try {
      const OLLAMA_RESPONSE = await axios.get(`${BASE_API_URL}/message-history`) // JSON body should be { prompt: PROMPT }
      const MESSAGE = OLLAMA_RESPONSE.data
      SET_CHAT_HISTORY(MESSAGE)
      SET_CHAT_HISTORY(MESSAGE)
      SET_IS_HISTORY_VISIBLE(!IS_HISTORY_VISIBLE)
    } catch (error) {
      console.error('Error making request:', error)
    }
  }

  return (
    <>      
      <div className="card">
        <h2>Ask me anything!</h2>
        <textarea 
          value={PROMPT} 
          onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => SET_PROMPT(e.target.value)} 
          rows={4} 
          cols={50} 
          placeholder="Type your message..."
        />
        <div>
          <button onClick={HANDLE_BUTTON_CLICK}>
            Prompt'u Gönder
          </button>
          <button onClick={HANDLE_BUTTON_HISTORY}>
            {IS_HISTORY_VISIBLE ? 'Geçmişi Gizle' : 'Geçmişi Göster'}
          </button>
        </div>
        {IS_HISTORY_VISIBLE && (
          <div className="chat-box">
            {CHAT_HISTORY.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.role}`}>
                <span>{chat.content}</span>
              </div>
            ))}
          </div>
        )}
        <p>
          <code>{OLLAMA_RESPONSE}</code>
        </p>
      </div>
    </>
  )
}
export default App
