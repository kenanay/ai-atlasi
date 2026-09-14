'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Topic } from '@/types';
import { CATEGORY_INFO } from '@/lib/utils';
import TopicNode from './TopicNode';

interface LearningMapGraphProps {
  topics: Topic[];
  completedTopics: string[];
  onTopicClick: (topicId: string) => void;
  fullscreen?: boolean;
}

const nodeTypes: NodeTypes = {
  topicNode: TopicNode,
};

export default function LearningMapGraph({
  topics,
  completedTopics,
  onTopicClick,
  fullscreen = false,
}: LearningMapGraphProps) {
  // Graf düzenini hesapla (kategorilere göre gruplandırılmış)
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Kategorilere göre konuları grupla
    const categoryGroups = new Map<string, Topic[]>();
    topics.forEach(topic => {
      const categoryName = CATEGORY_INFO[topic.category]?.name || topic.category;
      if (!categoryGroups.has(categoryName)) {
        categoryGroups.set(categoryName, []);
      }
      categoryGroups.get(categoryName)!.push(topic);
    });
    
    // Her kategori için yatay pozisyon
    const categorySpacing = 600;
    const topicSpacing = 180;
    let categoryIndex = 0;
    
    const categoryPositions = new Map<string, number>();
    Array.from(categoryGroups.keys()).forEach(category => {
      categoryPositions.set(category, categoryIndex * categorySpacing);
      categoryIndex++;
    });
    
    // Önkoşul seviyelerini hesapla (topological sort benzeri)
    const topicLevels = new Map<string, number>();
    const calculateLevel = (topicId: string, visited = new Set<string>()): number => {
      if (topicLevels.has(topicId)) return topicLevels.get(topicId)!;
      if (visited.has(topicId)) return 0; // Döngü tespit
      
      const topic = topics.find(t => t.id === topicId);
      if (!topic || topic.prerequisites.length === 0) {
        topicLevels.set(topicId, 0);
        return 0;
      }
      
      visited.add(topicId);
      const maxPrereqLevel = Math.max(
        ...topic.prerequisites.map(prereqId => calculateLevel(prereqId, new Set(visited)))
      );
      const level = maxPrereqLevel + 1;
      topicLevels.set(topicId, level);
      return level;
    };
    
    topics.forEach(topic => calculateLevel(topic.id));
    
    // Node'ları oluştur
    categoryGroups.forEach((categoryTopics, categoryName) => {
      const categoryX = categoryPositions.get(categoryName) || 0;
      
      // Kategori içindeki konuları seviyeye göre sırala
      const sortedTopics = categoryTopics.sort((a, b) => {
        const levelA = topicLevels.get(a.id) || 0;
        const levelB = topicLevels.get(b.id) || 0;
        return levelA - levelB;
      });
      
      sortedTopics.forEach((topic, index) => {
        const level = topicLevels.get(topic.id) || 0;
        const y = level * topicSpacing + (index % 3) * 60; // Slight offset for same-level topics
        
        // Konu durumunu belirle
        const isCompleted = completedTopics.includes(topic.id);
        const isUnlocked = topic.prerequisites.length === 0 || 
          topic.prerequisites.every(prereq => completedTopics.includes(prereq));
        
        let status: 'completed' | 'unlocked' | 'locked' = 'locked';
        if (isCompleted) status = 'completed';
        else if (isUnlocked) status = 'unlocked';
        
        nodes.push({
          id: topic.id,
          type: 'topicNode',
          position: { x: categoryX, y },
          data: {
            topic,
            status,
            category: categoryName,
            onClick: () => onTopicClick(topic.id),
          },
        });
      });
    });
    
    // Edge'leri oluştur (önkoşul ilişkileri)
    topics.forEach(topic => {
      topic.prerequisites.forEach(prereqId => {
        // Sadece her iki node da varsa edge ekle
        if (nodes.find(n => n.id === prereqId) && nodes.find(n => n.id === topic.id)) {
          edges.push({
            id: `${prereqId}-${topic.id}`,
            source: prereqId,
            target: topic.id,
            type: 'smoothstep',
            animated: !completedTopics.includes(topic.id) && 
                     completedTopics.includes(prereqId),
            style: {
              stroke: completedTopics.includes(prereqId) ? '#10b981' : '#9ca3af',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: completedTopics.includes(prereqId) ? '#10b981' : '#9ca3af',
            },
          });
        }
      });
    });
    
    return { nodes, edges };
  }, [topics, completedTopics, onTopicClick]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // topics veya completedTopics değiştiğinde nodes ve edges'i güncelle
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [topics, completedTopics, initialNodes, initialEdges, setNodes, setEdges]);
  
  return (
    <div style={{ width: '100%', height: fullscreen ? '100%' : '800px' }} className={fullscreen ? '' : 'border rounded-lg overflow-hidden'}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={fullscreen ? 2.0 : 1.5}
        defaultViewport={{ x: 0, y: 0, zoom: fullscreen ? 0.6 : 0.5 }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const status = node.data.status;
            if (status === 'completed') return '#10b981'; // green
            if (status === 'unlocked') return '#3b82f6'; // blue
            return '#9ca3af'; // gray
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
