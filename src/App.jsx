//App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 20;

const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const FoodType = {
  CV: 'CV',
  Proyectos: 'Proyectos',
  Contacto: 'Contacto',
};

const App = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [counters, setCounters] = useState({
    CV: 0,
    Proyectos: 0,
    Contacto: 0,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [foodType, setFoodType] = useState(getRandomFoodType());



  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        setIsPaused(!isPaused);
        console.log(food);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          if (!isPaused && direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (!isPaused && direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (!isPaused && direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (!isPaused && direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, isPaused]);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOver || isPaused) return;

      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case Direction.UP:
          head.y -= 1;
          break;
        case Direction.DOWN:
          head.y += 1;
          break;
        case Direction.LEFT:
          head.x -= 1;
          break;
        case Direction.RIGHT:
          head.x += 1;
          break;
        default:
          break;
      }

      // Check if snake eats food
      if (head.x === food.x && head.y === food.y) {
        const newFood = getRandomPosition();
        setFood(newFood);
        setFoodType (getRandomFoodType());
        const newCounters = { ...counters, [foodType]: counters[foodType] + 1 };
        setCounters(newCounters);
        newSnake.push({});
        checkCounters(newCounters);
      } else {
        newSnake.pop();
      }

      // Check if snake hits wall or itself
      if (
        head.x < 0 ||
        head.x >= COLS ||
        head.y < 0 ||
        head.y >= ROWS ||
        newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
      }

      newSnake.unshift(head);
      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, 100);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, counters, isPaused]);

  const checkCounters = (counters) => {
    if (counters.CV === 3) {
      alert('¡Has comido 3 veces la comida CV!');
    }
    if (counters.Proyectos === 3) {
      alert('¡Has comido 3 veces la comida Proyectos!');
    }
    if (counters.Contacto === 3) {
      alert('¡Has comido 3 veces la comida Contacto!');
    }
  };

  const renderCell = (x, y, type) => {
    const style = {
      left: `${x * CELL_SIZE}px`,
      top: `${y * CELL_SIZE}px`,
      width: `${CELL_SIZE}px`,
      height: `${CELL_SIZE}px`,
    };

    return <div className={`cell ${type}`} style={style}></div>;
  };

  const renderBoard = () => {
    const cells = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        let type = '';
        if (gameOver) {
          type = 'game-over';
        } else if (x === food.x && y === food.y) {
          type = foodType;
        } else if (snake.some((segment) => segment.x === x && segment.y === y)) {
          type = 'snake';
        }
  
        const style = {
          left: `${x * CELL_SIZE}px`,
          top: `${y * CELL_SIZE}px`,
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
        };
  
        cells.push(<div key={`${x},${y}`} className={`cell ${type}`} style={style}></div>);
      }
    }
  
    return cells;
  };
  

  return (
    <>
      <div className="counters">
        <div className="counter">
          CV: {counters.CV}
        </div>
        <div className="counter">
          Proyectos: {counters.Proyectos}
        </div>
        <div className="counter">
          Contacto: {counters.Contacto}
        </div>
      </div>
      <div className="snake-game">
        {renderBoard()}
      </div>
    </>
  );
};

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };
};

const getRandomFoodType = () => {
  const types = Object.values(FoodType);
  return types[Math.floor(Math.random() * types.length)];
};

export default App;
