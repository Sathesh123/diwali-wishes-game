import React, { useState, useEffect } from 'react';
import './App.css';
import dogImage from './images/dog.jpeg';
import biscuitImage from './images/biscuit.jpeg';
import milkImage from './images/milk.jpeg';
import crackerImage from './images/cracker.jpeg';
import roadImage from './images/road.jpeg';
import leftArrowImage from './images/left-arrow.png';
import rightArrowImage from './images/right-arrow.png';
import refreshImage from './images/refresh.png';

function App() {
  const [score, setScore] = useState(0);
  const [dogPosition, setDogPosition] = useState(1); // 0: left, 1: center, 2: right
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [objects, setObjects] = useState([]); // Stores the moving objects
  const [speed, setSpeed] = useState(1); // Reduced speed for slower object movement

  // Function to reset the game
  const resetGame = () => {
    setScore(0);
    setDogPosition(1); // Reset dog to center lane
    setGameOver(false);
    setGameStarted(false);
    setObjects([]);
  };

  // Function to start the game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    spawnObjects(); // Start spawning objects
  };

  // Function to move the dog left
  const moveLeft = () => {
    if (dogPosition > 0) {
      setDogPosition(dogPosition - 1); // Move left
    }
  };

  // Function to move the dog right
  const moveRight = () => {
    if (dogPosition < 2) {
      setDogPosition(dogPosition + 1); // Move right
    }
  };

  // Function to randomly generate objects (food or obstacle)
  const spawnObjects = () => {
    debugger
    const spawnInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(spawnInterval);
        return;
      }

      // Random lane (0, 1, or 2)
      const lane = Math.floor(Math.random() * 3);
      
      // 40% chance of biscuit, 40% chance of milk, 20% chance of cracker
      const randomValue = Math.random();
      let objectType;
      if (randomValue < 0.4) {
        objectType = 'biscuit';
      } else if (randomValue < 0.8) {
        objectType = 'milk';
      } else {
        objectType = 'cracker'; // Less frequent
      }

      // Add the new object to the list
      setObjects((prevObjects) => [
        ...prevObjects,
        { lane, type: objectType, position: 0 } // position is the y-coordinate (starting at top 0)
      ]);
    }, 2500); // Slower spawn rate, objects spawn every 2.5 seconds
  };

  // Handle the movement of objects
  useEffect(() => {
    debugger
    if (gameStarted && !gameOver) {
      const moveInterval = setInterval(() => {
        setObjects((prevObjects) => {
          return prevObjects
            .map((obj) => ({
              ...obj,
              position: obj.position + speed // Move the object down slower
            }))
            .filter((obj) => obj.position < 100); // Remove objects that go off the screen
        });
        detectCollisions();
      }, 100); // Update position every 100ms

      return () => clearInterval(moveInterval); // Clear interval when component unmounts
    }
  }, [gameStarted, gameOver, objects, dogPosition, speed]);

  // Detect collision between dog and objects
  const detectCollisions1 = () => {
    debugger
    objects.forEach((obj) => {
      if (obj.lane === dogPosition && obj.position > 80 && obj.position < 90) {
        if (obj.type === 'cracker') {
          setGameOver(true); // Game over if the dog hits cracker
        } else {
          setScore((prevScore) => prevScore + 1);//(obj.type === 'biscuit' ? 1 : 2));
          // Remove the object after collision
          setObjects((prevObjects) => prevObjects.filter((o) => o !== obj));
        }
      }
    });
  };

  // Detect collision between dog and objects
  // Detect collision between dog and objects
  const detectCollisions = () => {
    setObjects((prevObjects) =>
      prevObjects.filter((obj) => {
        // Check if the object is in the same lane as the dog
        if (obj.lane === dogPosition) {
          // Check if the object is in the range of the dog's position (e.g., between 80% and 90%)
          //if (obj.position > 80 && obj.position < 90) {
          if (obj.position > 80 ) {
            if (obj.type === 'cracker') {
              setGameOver(true); // Game over if the dog hits cracker
              return false; // Remove the cracker object once the game is over
            } else {
              // Add score based on the type of object (biscuit or milk)
              setScore((prevScore) => prevScore + (obj.type === 'biscuit' ? 1 : 2));

              // Return false to remove the object after it has been "collected"
              return false;
            }
          }
        }
        // Return true to keep the object if there's no collision
        return true;
      })
    );
  };



  return (
    <div className="game-container">
      <div className="top-bar">
        <h1>Score: {score}</h1>
        <button onClick={resetGame}>
          <img src={refreshImage} alt="Refresh" />
        </button>
      </div>

      <div className="game-screen">
        <img src={roadImage} className="road" alt="road" />
        <img src={dogImage} className={`dog lane-${dogPosition}`} alt="dog" />

        {/* Render moving objects */}

        {objects.map((obj, index) => (
          <img
            key={index}
            src={obj.type === 'biscuit' ? biscuitImage : obj.type === 'milk' ? milkImage : crackerImage}
            className={`object lane-${obj.lane}`}
            style={{ top: `${obj.position}%` }}
            alt={obj.type}
          />
        ))}

      </div>

      <div className="controls">
        <button onClick={moveLeft}>
          <img src={leftArrowImage} alt="left" />
        </button>
        <button onClick={moveRight}>
          <img src={rightArrowImage} alt="right" />
        </button>
      </div>

      {!gameStarted && (
        <button className="start-button" onClick={startGame}>Start</button>
      )}

      {gameOver && <h2 className="gameOver">Game Over</h2>}
    </div>
  );
}

export default App;

