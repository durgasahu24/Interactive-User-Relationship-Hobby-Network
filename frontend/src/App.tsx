import { useState } from 'react'
import './App.css'


function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <>
      <h1>Hello World</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}


export default App;