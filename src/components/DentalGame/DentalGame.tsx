"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./DentalGame.module.scss";

interface Tooth {
  id: number;
  x: number;
  y: number;
  cleanliness: number; // 0-100
  type: "molar" | "incisor" | "canine";
}

type Bonus = { x: number; y: number; visible: boolean };

export default function DentalGame() {
  const [teeth, setTeeth] = useState<Tooth[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [brushing, setBrushing] = useState(false);
  const [brushPosition, setBrushPosition] = useState({ x: 0, y: 0 });
  const [bonus, setBonus] = useState<Bonus>({ x: 50, y: 50, visible: false });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialTeeth: Tooth[] = [
      { id: 1, x: 15, y: 20, cleanliness: 0, type: "molar" },
      { id: 2, x: 30, y: 15, cleanliness: 0, type: "incisor" },
      { id: 3, x: 45, y: 12, cleanliness: 0, type: "canine" },
      { id: 4, x: 60, y: 15, cleanliness: 0, type: "incisor" },
      { id: 5, x: 75, y: 20, cleanliness: 0, type: "molar" },
      { id: 6, x: 15, y: 70, cleanliness: 0, type: "molar" },
      { id: 7, x: 30, y: 75, cleanliness: 0, type: "incisor" },
      { id: 8, x: 45, y: 78, cleanliness: 0, type: "canine" },
      { id: 9, x: 60, y: 75, cleanliness: 0, type: "incisor" },
      { id: 10, x: 75, y: 70, cleanliness: 0, type: "molar" },
    ];
    setTeeth(initialTeeth);
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
    if (timeLeft === 0 && gameStarted) endGame();
  }, [timeLeft, gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const allClean = teeth.length > 0 && teeth.every((t) => t.cleanliness === 100);
    if (allClean) endGame(true);
  }, [teeth, gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const timeout = setTimeout(() => {
      const x = 15 + Math.random() * 70;
      const y = 20 + Math.random() * 60;
      setBonus({ x, y, visible: true });
      const hide = setTimeout(() => setBonus((b) => ({ ...b, visible: false })), 5000);
      return () => clearTimeout(hide);
    }, 7000 + Math.random() * 4000);
    return () => clearTimeout(timeout);
  }, [gameStarted, gameOver, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setBonus((b) => ({ ...b, visible: false }));
    setTeeth((prev) => prev.map((t) => ({ ...t, cleanliness: 0 })));
  };

  const endGame = (won = false) => {
    setGameOver(true);
    setGameStarted(false);
    if (won) setTimeLeft((v) => v);
  };

  const updateBrushFromMouse = (e: React.MouseEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    setBrushPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const updateBrushFromTouch = (e: React.TouchEvent) => {
    if (!gameAreaRef.current) return;
    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    setBrushPosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  };

  const brushAt = (clientX: number, clientY: number) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = ((clientX - rect.left) / rect.width) * 100;
    const mouseY = ((clientY - rect.top) / rect.height) * 100;

    setTeeth((prev) => {
      const updated = prev.map((tooth) => {
        const d = Math.hypot(tooth.x - mouseX, tooth.y - mouseY);
        if (d < 8) {
          const gain = d < 4 ? 3 : 2;
          const newCleanliness = Math.min(tooth.cleanliness + gain, 100);
          if (newCleanliness === 100 && tooth.cleanliness < 100) setScore((s) => s + 10);
          return { ...tooth, cleanliness: newCleanliness };
        }
        return tooth;
      });
      return updated;
    });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setBrushing(true);
    updateBrushFromMouse(e);
    brushAt(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!brushing || !gameStarted || gameOver) return;
    updateBrushFromMouse(e);
    brushAt(e.clientX, e.clientY);
  };
  const onMouseUp = () => setBrushing(false);

  const onTouchStart = (e: React.TouchEvent) => {
    setBrushing(true);
    updateBrushFromTouch(e);
    const t = e.touches[0];
    brushAt(t.clientX, t.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    updateBrushFromTouch(e);
    const t = e.touches[0];
    brushAt(t.clientX, t.clientY);
  };
  const onTouchEnd = () => setBrushing(false);

  const claimBonus = () => {
    if (!bonus.visible) return;
    setBonus((b) => ({ ...b, visible: false }));
    setTimeLeft((t) => Math.min(t + 5, 120));
    setScore((s) => s + 20);
  };

  const getToothColor = (cleanliness: number) => {
    if (cleanliness < 30) return "#8B7355";
    if (cleanliness < 60) return "#D4C5B9";
    if (cleanliness < 90) return "#E8E4E0";
    return "#FFFFFF";
  };

  const totalCleanliness =
    teeth.length > 0 ? teeth.reduce((sum, t) => sum + t.cleanliness, 0) / teeth.length : 0;

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h2>🦷 Juego de Cepillado Dental 🪥</h2>
        <p>¡Cepillá todos los dientes para dejarlos brillando!</p>
      </div>

      {!gameStarted && !gameOver && (
        <div className={styles.startScreen}>
          <div className={styles.instructions}>
            <h3>¿Cómo jugar?</h3>
            <ul>
              <li>🖱️ Mantené presionado el mouse y arrastrá sobre los dientes</li>
              <li>📱 En celular, tocá y arrastrá con el dedo</li>
              <li>⏱️ Tenés 60 segundos para limpiarlos todos</li>
              <li>⭐ Sumás 10 puntos por diente limpio</li>
            </ul>
          </div>
          <button className={styles.startButton} onClick={startGame}>
            ¡Empezar!
          </button>
        </div>
      )}

      {gameStarted && (
        <>
          <div className={styles.gameStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Puntaje</span>
              <span className={styles.statValue}>{score}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Tiempo</span>
              <span className={styles.statValue}>{timeLeft}s</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Limpieza</span>
              <span className={styles.statValue}>{Math.round(totalCleanliness)}%</span>
            </div>
          </div>

          <div
            ref={gameAreaRef}
            className={styles.gameArea}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className={styles.mouth}>
              {teeth.map((tooth) => (
                <div
                  key={tooth.id}
                  className={`${styles.tooth} ${styles[tooth.type]}`}
                  style={{
                    left: `${tooth.x}%`,
                    top: `${tooth.y}%`,
                    backgroundColor: getToothColor(tooth.cleanliness),
                  }}
                >
                  {tooth.cleanliness < 100 && (
                    <div className={styles.germs}>
                      {tooth.cleanliness < 30 && "🦠🦠🦠"}
                      {tooth.cleanliness >= 30 && tooth.cleanliness < 60 && "🦠🦠"}
                      {tooth.cleanliness >= 60 && tooth.cleanliness < 90 && "🦠"}
                    </div>
                  )}
                  {tooth.cleanliness === 100 && <div className={styles.sparkle}>✨</div>}
                </div>
              ))}

              {bonus.visible && (
                <button
                  type="button"
                  className={styles.bonusStar}
                  style={{ left: `${bonus.x}%`, top: `${bonus.y}%` }}
                  onClick={claimBonus}
                >
                  ⭐
                </button>
              )}

              {brushing && (
                <div
                  className={styles.toothbrush}
                  style={{ left: brushPosition.x, top: brushPosition.y }}
                >
                  🪥
                </div>
              )}
            </div>

            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${totalCleanliness}%` }} />
            </div>
          </div>
        </>
      )}

      {gameOver && (
        <div className={styles.gameOverScreen}>
          <h3>¡Fin del juego! 🎉</h3>
          <div className={styles.finalStats}>
            <p className={styles.finalScore}>
              Puntaje final: <strong>{score}</strong>
            </p>
            <p className={styles.finalCleanliness}>
              Limpieza total: <strong>{Math.round(totalCleanliness)}%</strong>
            </p>
          </div>
          <div className={styles.message}>
            {totalCleanliness === 100 ? (
              <p className={styles.perfect}>🌟 ¡Boca impecable! ¡Todos los dientes están súper limpios! 🌟</p>
            ) : totalCleanliness >= 80 ? (
              <p className={styles.great}>😊 ¡Muy bien! ¡Casi todos están listos!</p>
            ) : totalCleanliness >= 50 ? (
              <p className={styles.good}>👍 Buen laburo. Falta un poquito más de cepillado.</p>
            ) : (
              <p className={styles.tryAgain}>💪 Volvé a intentar. ¡Dale con ganas al cepillo!</p>
            )}
          </div>
          <button className={styles.playAgainButton} onClick={startGame}>
            Jugar de nuevo
          </button>
        </div>
      )}

      <div className={styles.tip}>
        💡 <strong>Consejo:</strong> cepillate los dientes 2 veces por día durante 2 minutos.
      </div>
    </div>
  );
}
