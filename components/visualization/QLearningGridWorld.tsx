'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, Pause, Zap, Settings, Info, Trophy, Flame } from 'lucide-react';

interface QLearningGridWorldProps {
  title?: string;
}

type CellType = 'empty' | 'wall' | 'goal' | 'pit' | 'start';

interface Cell {
  type: CellType;
  reward: number;
}

interface Position {
  row: number;
  col: number;
}

const GRID_SIZE = 5;
const ACTIONS = ['up', 'down', 'left', 'right'] as const;
type Action = typeof ACTIONS[number];

export function QLearningGridWorld({ title = 'Q-Learning Grid World' }: QLearningGridWorldProps) {
  // Grid state
  const [grid, setGrid] = useState<Cell[][]>(() => initializeGrid());
  const [agentPos, setAgentPos] = useState<Position>({ row: 0, col: 0 });
  const [goalPos, setGoalPos] = useState<Position>({ row: 4, col: 4 });
  
  // Q-Learning parameters
  const [qTable, setQTable] = useState<Record<string, Record<Action, number>>>({});
  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [epsilon, setEpsilon] = useState(0.3);
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [episodeRewards, setEpisodeRewards] = useState<number[]>([]);
  const [speed, setSpeed] = useState(1);
  const [showQValues, setShowQValues] = useState(false);
  const [path, setPath] = useState<Position[]>([]);
  
  function initializeGrid(): Cell[][] {
    const newGrid: Cell[][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      newGrid[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        if (i === 0 && j === 0) {
          newGrid[i][j] = { type: 'start', reward: 0 };
        } else if (i === 4 && j === 4) {
          newGrid[i][j] = { type: 'goal', reward: 100 };
        } else if ((i === 2 && j === 2) || (i === 1 && j === 3)) {
          newGrid[i][j] = { type: 'pit', reward: -50 };
        } else if ((i === 3 && j === 1)) {
          newGrid[i][j] = { type: 'wall', reward: 0 };
        } else {
          newGrid[i][j] = { type: 'empty', reward: -1 };
        }
      }
    }
    return newGrid;
  }
  
  const getQValue = useCallback((state: string, action: Action): number => {
    if (!qTable[state]) return 0;
    return qTable[state][action] || 0;
  }, [qTable]);
  
  const setQValue = useCallback((state: string, action: Action, value: number) => {
    setQTable(prev => ({
      ...prev,
      [state]: {
        ...prev[state],
        [action]: value
      }
    }));
  }, []);
  
  const stateKey = (pos: Position) => `${pos.row},${pos.col}`;
  
  const isValidMove = (pos: Position): boolean => {
    return pos.row >= 0 && pos.row < GRID_SIZE && 
           pos.col >= 0 && pos.col < GRID_SIZE &&
           grid[pos.row][pos.col].type !== 'wall';
  };
  
  const getNextPosition = (pos: Position, action: Action): Position => {
    const moves = {
      up: { row: pos.row - 1, col: pos.col },
      down: { row: pos.row + 1, col: pos.col },
      left: { row: pos.row, col: pos.col - 1 },
      right: { row: pos.row, col: pos.col + 1 }
    };
    const newPos = moves[action];
    return isValidMove(newPos) ? newPos : pos;
  };
  
  const selectAction = (pos: Position): Action => {
    // Epsilon-greedy
    if (Math.random() < epsilon) {
      // Explore: random action
      return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    } else {
      // Exploit: best action
      const state = stateKey(pos);
      const qValues = ACTIONS.map(action => ({
        action,
        value: getQValue(state, action)
      }));
      return qValues.reduce((best, current) => 
        current.value > best.value ? current : best
      ).action;
    }
  };
  
  const runEpisode = useCallback(async () => {
    let currentPos = { row: 0, col: 0 };
    let episodeReward = 0;
    let steps = 0;
    const maxSteps = 50;
    const episodePath: Position[] = [{ ...currentPos }];
    
    while (steps < maxSteps) {
      const currentState = stateKey(currentPos);
      const action = selectAction(currentPos);
      const nextPos = getNextPosition(currentPos, action);
      const reward = grid[nextPos.row][nextPos.col].reward;
      const nextState = stateKey(nextPos);
      
      // Q-Learning update
      const currentQ = getQValue(currentState, action);
      const maxNextQ = Math.max(...ACTIONS.map(a => getQValue(nextState, a)));
      const newQ = currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
      setQValue(currentState, action, newQ);
      
      episodeReward += reward;
      currentPos = nextPos;
      episodePath.push({ ...currentPos });
      
      // Visualize step
      setAgentPos({ ...currentPos });
      setPath([...episodePath]);
      setTotalReward(prev => prev + reward);
      
      await new Promise(resolve => setTimeout(resolve, 200 / speed));
      
      // Check terminal states
      if (grid[currentPos.row][currentPos.col].type === 'goal' ||
          grid[currentPos.row][currentPos.col].type === 'pit') {
        break;
      }
      
      steps++;
    }
    
    setEpisodeRewards(prev => [...prev, episodeReward]);
    setEpisode(prev => prev + 1);
    setAgentPos({ row: 0, col: 0 });
    setPath([]);
    
  }, [grid, learningRate, discountFactor, epsilon, speed, getQValue, setQValue]);
  
  useEffect(() => {
    if (isRunning) {
      // Use requestAnimationFrame to avoid React 19 setState-in-effect warning
      const frame = requestAnimationFrame(() => {
        runEpisode().then(() => {
          if (isRunning) {
            // Continue to next episode
            setTimeout(() => {}, 100);
          }
        });
      });
      
      return () => cancelAnimationFrame(frame);
    }
  }, [isRunning, episode]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleStart = () => {
    setIsRunning(true);
  };
  
  const handlePause = () => {
    setIsRunning(false);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setQTable({});
    setEpisode(0);
    setTotalReward(0);
    setEpisodeRewards([]);
    setAgentPos({ row: 0, col: 0 });
    setPath([]);
  };
  
  const getCellColor = (cell: Cell) => {
    switch (cell.type) {
      case 'start': return 'bg-blue-200 dark:bg-blue-900/50';
      case 'goal': return 'bg-green-200 dark:bg-green-900/50';
      case 'pit': return 'bg-red-200 dark:bg-red-900/50';
      case 'wall': return 'bg-gray-400 dark:bg-gray-700';
      default: return 'bg-gray-50 dark:bg-gray-800/30';
    }
  };
  
  const getBestAction = (row: number, col: number): { action: Action; value: number } | null => {
    const state = stateKey({ row, col });
    if (!qTable[state]) return null;
    
    const qValues = ACTIONS.map(action => ({
      action,
      value: getQValue(state, action)
    }));
    
    return qValues.reduce((best, current) => 
      current.value > best.value ? current : best
    );
  };
  
  const getArrowForAction = (action: Action) => {
    switch (action) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'left': return '←';
      case 'right': return '→';
    }
  };
  
  const avgReward = episodeRewards.length > 0 
    ? episodeRewards.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, episodeRewards.length)
    : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-lg sm:text-xl">{title}</span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Trophy className="w-3 h-3" />
              <span>Episode: {episode}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs">
              <Zap className="w-3 h-3" />
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded ${
                    speed === s ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            
            {!isRunning ? (
              <Button size="sm" onClick={handleStart}>
                <Play className="w-4 h-4 mr-1" />
                Başlat
              </Button>
            ) : (
              <Button size="sm" onClick={handlePause}>
                <Pause className="w-4 h-4 mr-1" />
                Duraklat
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-grid gap-1 p-4 bg-white dark:bg-gray-900/50 rounded-lg border-2 border-gray-300 dark:border-gray-600">
              {grid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1">
                  {row.map((cell, colIdx) => {
                    const isAgent = agentPos.row === rowIdx && agentPos.col === colIdx;
                    const isInPath = path.some(p => p.row === rowIdx && p.col === colIdx);
                    const bestAction = showQValues ? getBestAction(rowIdx, colIdx) : null;
                    
                    return (
                      <div
                        key={colIdx}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                          getCellColor(cell)
                        } ${isInPath ? 'ring-2 ring-yellow-400' : 'border-gray-300 dark:border-gray-600'}`}
                      >
                        {/* Cell type icon/text */}
                        {cell.type === 'start' && <span className="text-xs font-bold">START</span>}
                        {cell.type === 'goal' && <span className="text-xs font-bold">🏁</span>}
                        {cell.type === 'pit' && <span className="text-xs font-bold">💀</span>}
                        {cell.type === 'wall' && <span className="text-xs font-bold">⬛</span>}
                        
                        {/* Agent */}
                        {isAgent && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-purple-500 animate-pulse flex items-center justify-center text-white font-bold">
                              🤖
                            </div>
                          </div>
                        )}
                        
                        {/* Q-Value arrow */}
                        {showQValues && bestAction && bestAction.value !== 0 && !isAgent && cell.type === 'empty' && (
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {getArrowForAction(bestAction.action)}
                          </div>
                        )}
                        
                        {/* Reward */}
                        {cell.reward !== 0 && (
                          <div className="absolute bottom-0 right-0 text-[10px] font-bold px-1 bg-black/50 text-white rounded">
                            {cell.reward > 0 ? '+' : ''}{cell.reward}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Controls and Stats */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Parameters */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Hiperparametreler
              </h3>
              
              <div>
                <label className="text-xs flex justify-between mb-1">
                  <span>Learning Rate (α)</span>
                  <span className="font-mono">{learningRate.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full"
                  disabled={isRunning}
                />
              </div>
              
              <div>
                <label className="text-xs flex justify-between mb-1">
                  <span>Discount Factor (γ)</span>
                  <span className="font-mono">{discountFactor.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={discountFactor}
                  onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
                  className="w-full"
                  disabled={isRunning}
                />
              </div>
              
              <div>
                <label className="text-xs flex justify-between mb-1">
                  <span>Epsilon (ε) - Keşif</span>
                  <span className="font-mono">{epsilon.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={epsilon}
                  onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                  className="w-full"
                  disabled={isRunning}
                />
              </div>
              
              <button
                onClick={() => setShowQValues(!showQValues)}
                className="w-full text-xs py-2 px-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                {showQValues ? 'Q-Values Gizle' : 'Q-Values Göster'}
              </button>
            </div>
            
            {/* Stats */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                İstatistikler
              </h3>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Toplam Episode:</span>
                  <span className="font-mono font-bold">{episode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kümülatif Ödül:</span>
                  <span className="font-mono font-bold">{totalReward.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Son 10 Ortalama:</span>
                  <span className="font-mono font-bold">{avgReward.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Öğrenilen State:</span>
                  <span className="font-mono font-bold">{Object.keys(qTable).length}</span>
                </div>
              </div>
              
              {/* Reward chart */}
              {episodeRewards.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs mb-1">Episode Ödülleri (son 20):</div>
                  <div className="flex items-end gap-0.5 h-20">
                    {episodeRewards.slice(-20).map((reward, idx) => {
                      const maxReward = Math.max(...episodeRewards.slice(-20));
                      const minReward = Math.min(...episodeRewards.slice(-20));
                      const range = maxReward - minReward || 1;
                      const height = ((reward - minReward) / range) * 100;
                      const color = reward > 0 ? 'bg-green-500' : 'bg-red-500';
                      
                      return (
                        <div
                          key={idx}
                          className={`flex-1 ${color} rounded-t transition-all`}
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`Episode ${episode - 20 + idx + 1}: ${reward.toFixed(0)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <h3 className="font-semibold text-xs mb-2">Açıklama:</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900/50 rounded"></div>
                  <span>Başlangıç</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 dark:bg-green-900/50 rounded"></div>
                  <span>Hedef (+100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 dark:bg-red-900/50 rounded"></div>
                  <span>Çukur (-50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 dark:bg-gray-700 rounded"></div>
                  <span>Duvar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs">
          <p><strong>Q-Learning:</strong> Ajan, epsilon-greedy policy ile keşif/sömürü dengesini koruyarak optimal yolu öğrenir. 
          Her adımda Q-değerleri güncellenir: Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]</p>
        </div>
      </CardContent>
    </Card>
  );
}
