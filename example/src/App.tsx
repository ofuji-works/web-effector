import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { EffectCore } from 'web-effector';

function App() {
  const [count, setCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fn = async () => {
    if (!canvasRef.current) {
      throw new Error('Canvas is not initialized');
    }
    const effectCore = new EffectCore();
    await effectCore.connect();
    await effectCore.analyze(canvasRef.current);
  };

  useEffect(() => {
    fn();
  }, []);

  return (
    <>
      <div>
        <canvas id="canvas" ref={canvasRef} width="500" height="500"></canvas>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
