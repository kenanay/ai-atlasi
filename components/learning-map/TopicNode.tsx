'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Topic } from '@/types';
import { CATEGORY_INFO } from '@/lib/utils';

interface TopicNodeData {
  topic: Topic;
  status: 'completed' | 'unlocked' | 'locked';
  category: string;
  onClick: () => void;
}

function TopicNode({ data }: NodeProps<TopicNodeData>) {
  const { topic, status, category, onClick } = data;
  
  // Durum renklerini belirle
  const statusColors = {
    completed: 'bg-green-100 border-green-500 text-green-900',
    unlocked: 'bg-blue-100 border-blue-500 text-blue-900',
    locked: 'bg-gray-100 border-gray-400 text-gray-600',
  };
  
  const statusIcons = {
    completed: '✓',
    unlocked: '→',
    locked: '🔒',
  };
  
  const categoryInfo = CATEGORY_INFO[topic.category] || { icon: '📚', color: 'bg-gray-100' };
  
  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 shadow-md cursor-pointer
        transition-all duration-200 hover:shadow-lg hover:scale-105
        min-w-[200px] max-w-[250px]
        ${statusColors[status]}
      `}
      onClick={onClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400"
      />
      
      <div className="flex items-start gap-2">
        <span className="text-xl flex-shrink-0">{categoryInfo.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">{statusIcons[status]}</span>
            <h3 className="font-bold text-sm leading-tight truncate">
              {topic.shortTitle || topic.title}
            </h3>
          </div>
          
          <p className="text-xs opacity-75 mb-2 line-clamp-2">
            {topic.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs">
            <span className={`
              px-2 py-0.5 rounded-full font-medium
              ${topic.difficulty === 'beginner' ? 'bg-green-200' : ''}
              ${topic.difficulty === 'intermediate' ? 'bg-yellow-200' : ''}
              ${topic.difficulty === 'advanced' ? 'bg-orange-200' : ''}
            `}>
              {topic.difficulty === 'beginner' ? 'Başlangıç' : ''}
              {topic.difficulty === 'intermediate' ? 'Orta' : ''}
              {topic.difficulty === 'advanced' ? 'İleri' : ''}
            </span>
            <span className="opacity-60">
              {topic.estimatedTime} dk
            </span>
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
    </div>
  );
}

export default memo(TopicNode);
