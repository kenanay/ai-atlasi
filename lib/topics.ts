import { Topic, TopicCategory } from '@/types';
import { CATEGORY_INFO } from './utils';
import vectorsData from '@/data/topics/vectors.json';
import matricesTensorsData from '@/data/topics/matrices-tensors.json';
import derivativeData from '@/data/topics/derivative.json';
import gradientDescentData from '@/data/topics/gradient-descent.json';
import activationFunctionsData from '@/data/topics/activation-functions.json';
import lossFunctionsData from '@/data/topics/loss-functions.json';
import linearRegressionData from '@/data/topics/linear-regression.json';
import perceptronData from '@/data/topics/perceptron.json';
import backpropagationData from '@/data/topics/backpropagation.json';
import neuralNetworksData from '@/data/topics/neural-networks.json';
import convolutionalNeuralNetworksData from '@/data/topics/convolutional-neural-networks.json';
import recurrentNeuralNetworksData from '@/data/topics/recurrent-neural-networks.json';
import transformersAttentionData from '@/data/topics/transformers-attention.json';
import optimizersData from '@/data/topics/optimizers.json';
import regularizationData from '@/data/topics/regularization.json';
import batchNormalizationData from '@/data/topics/batch-normalization.json';
import transferLearningData from '@/data/topics/transfer-learning.json';
import resnetSkipConnectionsData from '@/data/topics/resnet-skip-connections.json';
import objectDetectionData from '@/data/topics/object-detection.json';
import imageSegmentationData from '@/data/topics/image-segmentation.json';
import generativeAdversarialNetworksData from '@/data/topics/generative-adversarial-networks.json';
import nlpFundamentalsData from '@/data/topics/nlp-fundamentals.json';
import bertLanguageModelsData from '@/data/topics/bert-language-models.json';
import reinforcementLearningBasicsData from '@/data/topics/reinforcement-learning-basics.json';
import autoencodersVaeData from '@/data/topics/autoencoders-vae.json';
import modelDeploymentProductionData from '@/data/topics/model-deployment-production.json';

// NEW TOPICS - Batch 1
import diffusionModelsData from '@/data/topics/diffusion-models.json';
import visionTransformersData from '@/data/topics/vision-transformers.json';
import largeLanguageModelsBasicsData from '@/data/topics/large-language-models-basics.json';
import logisticRegressionData from '@/data/topics/logistic-regression.json';
import lstmGruNetworksData from '@/data/topics/lstm-gru-networks.json';
import decisionTreesRandomForestsData from '@/data/topics/decision-trees-random-forests.json';
import supportVectorMachinesData from '@/data/topics/support-vector-machines.json';
import kmeansClusteringData from '@/data/topics/kmeans-clustering.json';

// NEW TOPICS - Batch 2 (Remaining 18)
import pcaDimensionalityReductionData from '@/data/topics/pca-dimensionality-reduction.json';
import timeSeriesForecastingData from '@/data/topics/time-series-forecasting.json';
import attentionMechanismsDetailData from '@/data/topics/attention-mechanisms-detail.json';
import graphNeuralNetworksData from '@/data/topics/graph-neural-networks.json';
import neuralArchitectureSearchData from '@/data/topics/neural-architecture-search.json';
import recommendationSystemsData from '@/data/topics/recommendation-systems.json';
import anomalyDetectionData from '@/data/topics/anomaly-detection.json';
import promptEngineeringData from '@/data/topics/prompt-engineering.json';
import multimodalModelsClipData from '@/data/topics/multimodal-models-clip.json';
import metaLearningFewShotData from '@/data/topics/meta-learning-few-shot.json';
import explainableAiXaiData from '@/data/topics/explainable-ai-xai.json';
import federatedLearningData from '@/data/topics/federated-learning.json';
import dataPreprocessingFeaturesData from '@/data/topics/data-preprocessing-features.json';
import modelCompressionPruningData from '@/data/topics/model-compression-pruning.json';
import distributedTrainingData from '@/data/topics/distributed-training.json';
import edgeAiMobileData from '@/data/topics/edge-ai-mobile.json';
import imbalancedDataHandlingData from '@/data/topics/imbalanced-data-handling.json';
import continualLearningData from '@/data/topics/continual-learning.json';

// NEW TOPICS - Batch 3 (Latest additions)
import kNearestNeighborsData from '@/data/topics/k-nearest-neighbors.json';
import naiveBayesData from '@/data/topics/naive-bayes.json';
import ensembleMethodsData from '@/data/topics/ensemble-methods.json';
import evaluationMetricsData from '@/data/topics/evaluation-metrics.json';
import wordEmbeddingsData from '@/data/topics/word-embeddings.json';
import dropoutRegularizationData from '@/data/topics/dropout-regularization.json';
import weightInitializationData from '@/data/topics/weight-initialization.json';
import sequenceToSequenceData from '@/data/topics/sequence-to-sequence.json';
import qLearningDqnData from '@/data/topics/q-learning-dqn.json';
import tokenizationData from '@/data/topics/tokenization.json';
import probabilityStatisticsData from '@/data/topics/probability-statistics.json';
import crossValidationData from '@/data/topics/cross-validation.json';
import learningRateSchedulingData from '@/data/topics/learning-rate-scheduling.json';
import cpuGpuArchitectureData from '@/data/topics/cpu-gpu-architecture.json';
import mlopsMonitoringData from '@/data/topics/mlops-monitoring.json';
import eigenvaluesEigenvectorsData from '@/data/topics/eigenvalues-eigenvectors.json';
import svdData from '@/data/topics/svd.json';
import ragVectorDatabasesData from '@/data/topics/rag-vector-databases.json';
import aiAgentsToolCallingData from '@/data/topics/ai-agents-tool-calling.json';

// SPRINT 4 - Critical Topics (Advanced ML/LLM)
import xgboostGradientBoostingData from '@/data/topics/xgboost-gradient-boosting.json';
import loraQloraPeftData from '@/data/topics/lora-qlora-peft.json';
import rlhfDpoAlignmentData from '@/data/topics/rlhf-dpo-alignment.json';
import tsneUmapManifoldData from '@/data/topics/tsne-umap-manifold.json';

// SPRINT 5 - Final Topics (LLM Inference, Speech AI, Clustering, Statistics)
import kvCacheLlmInferenceData from '@/data/topics/kv-cache-llm-inference.json';
import whisperSpeechAiData from '@/data/topics/whisper-speech-ai.json';
import mixtureOfExpertsData from '@/data/topics/mixture-of-experts.json';
import dbscanHierarchicalClusteringData from '@/data/topics/dbscan-hierarchical-clustering.json';
import mleMapEstimationData from '@/data/topics/mle-map-estimation.json';

// Tüm konular (şu an statik, ileride DB'den gelecek)
const topics: Topic[] = [
  vectorsData as unknown as Topic,
  matricesTensorsData as unknown as Topic,
  derivativeData as unknown as Topic,
  gradientDescentData as unknown as Topic,
  activationFunctionsData as unknown as Topic,
  lossFunctionsData as unknown as Topic,
  linearRegressionData as unknown as Topic,
  perceptronData as unknown as Topic,
  backpropagationData as unknown as Topic,
  neuralNetworksData as unknown as Topic,
  convolutionalNeuralNetworksData as unknown as Topic,
  recurrentNeuralNetworksData as unknown as Topic,
  transformersAttentionData as unknown as Topic,
  optimizersData as unknown as Topic,
  regularizationData as unknown as Topic,
  batchNormalizationData as unknown as Topic,
  transferLearningData as unknown as Topic,
  resnetSkipConnectionsData as unknown as Topic,
  objectDetectionData as unknown as Topic,
  imageSegmentationData as unknown as Topic,
  generativeAdversarialNetworksData as unknown as Topic,
  nlpFundamentalsData as unknown as Topic,
  bertLanguageModelsData as unknown as Topic,
  reinforcementLearningBasicsData as unknown as Topic,
  autoencodersVaeData as unknown as Topic,
  modelDeploymentProductionData as unknown as Topic,
  
  // NEW TOPICS - 26 additional topics!
  diffusionModelsData as unknown as Topic,
  visionTransformersData as unknown as Topic,
  largeLanguageModelsBasicsData as unknown as Topic,
  logisticRegressionData as unknown as Topic,
  lstmGruNetworksData as unknown as Topic,
  decisionTreesRandomForestsData as unknown as Topic,
  supportVectorMachinesData as unknown as Topic,
  kmeansClusteringData as unknown as Topic,
  pcaDimensionalityReductionData as unknown as Topic,
  timeSeriesForecastingData as unknown as Topic,
  attentionMechanismsDetailData as unknown as Topic,
  graphNeuralNetworksData as unknown as Topic,
  neuralArchitectureSearchData as unknown as Topic,
  recommendationSystemsData as unknown as Topic,
  anomalyDetectionData as unknown as Topic,
  promptEngineeringData as unknown as Topic,
  multimodalModelsClipData as unknown as Topic,
  metaLearningFewShotData as unknown as Topic,
  explainableAiXaiData as unknown as Topic,
  federatedLearningData as unknown as Topic,
  dataPreprocessingFeaturesData as unknown as Topic,
  modelCompressionPruningData as unknown as Topic,
  distributedTrainingData as unknown as Topic,
  edgeAiMobileData as unknown as Topic,
  imbalancedDataHandlingData as unknown as Topic,
  continualLearningData as unknown as Topic,
  
  // NEW BATCH 3 - Latest additions (15 total)
  kNearestNeighborsData as unknown as Topic,
  naiveBayesData as unknown as Topic,
  ensembleMethodsData as unknown as Topic,
  evaluationMetricsData as unknown as Topic,
  wordEmbeddingsData as unknown as Topic,
  dropoutRegularizationData as unknown as Topic,
  weightInitializationData as unknown as Topic,
  sequenceToSequenceData as unknown as Topic,
  qLearningDqnData as unknown as Topic,
  tokenizationData as unknown as Topic,
  probabilityStatisticsData as unknown as Topic,
  crossValidationData as unknown as Topic,
  learningRateSchedulingData as unknown as Topic,
  cpuGpuArchitectureData as unknown as Topic,
  mlopsMonitoringData as unknown as Topic,
  
  // NEW BATCH 4 - Critical Topics (Sprint 3)
  eigenvaluesEigenvectorsData as unknown as Topic,
  svdData as unknown as Topic,
  ragVectorDatabasesData as unknown as Topic,
  aiAgentsToolCallingData as unknown as Topic,
  
  // SPRINT 4 - Advanced ML/LLM Topics
  xgboostGradientBoostingData as unknown as Topic,
  loraQloraPeftData as unknown as Topic,
  rlhfDpoAlignmentData as unknown as Topic,
  tsneUmapManifoldData as unknown as Topic,
  
  // SPRINT 5 - Final Topics (79→80, MoE added)
  kvCacheLlmInferenceData as unknown as Topic,
  whisperSpeechAiData as unknown as Topic,
  mixtureOfExpertsData as unknown as Topic,
  dbscanHierarchicalClusteringData as unknown as Topic,
  mleMapEstimationData as unknown as Topic,
];

// Kategori bazlı gruplama (CATEGORY_INFO'dan konsolide grup adını kullanır)
export function getTopicsByCategory(): Map<string, Topic[]> {
  const grouped = new Map<string, Topic[]>();
  
  topics.forEach(topic => {
    // Ham kategori kodu yerine CATEGORY_INFO'daki konsolide grup adını kullan
    const groupName = CATEGORY_INFO[topic.category]?.name || topic.category;
    
    if (!grouped.has(groupName)) {
      grouped.set(groupName, []);
    }
    grouped.get(groupName)!.push(topic);
  });
  
  return grouped;
}

// ID ile konu getir
export function getTopicById(id: string): Topic | undefined {
  return topics.find(topic => topic.id === id);
}

// Tüm konuları getir
export function getAllTopics(): Topic[] {
  return topics;
}

// Kategori bazlı konuları getir
export function getTopicsByCategoryName(category: TopicCategory): Topic[] {
  return topics.filter(topic => topic.category === category);
}

// Arama
export function searchTopics(query: string): Topic[] {
  const lowerQuery = query.trim().toLocaleLowerCase('tr-TR');
  
  return topics.filter(topic => {
    // Başlıkta ara
    if (topic.title.toLocaleLowerCase('tr-TR').includes(lowerQuery)) return true;
    
    // Tag'lerde ara (tags undefined olabilir)
    if (topic.tags && Array.isArray(topic.tags)) {
      if (topic.tags.some(tag => tag.toLocaleLowerCase('tr-TR').includes(lowerQuery))) return true;
    }
    
    if (topic.description?.toLocaleLowerCase('tr-TR').includes(lowerQuery)) return true;
    
    // levels Array ise
    if (Array.isArray(topic.levels)) {
      if (topic.levels.some(item => item.content.toLocaleLowerCase('tr-TR').includes(lowerQuery))) return true;
    }
    // levels Object ise (beginner, intermediate, advanced)
    else if (topic.levels && typeof topic.levels === 'object') {
      const levelsObj = topic.levels as any;
      const searchInLevels = ['beginner', 'intermediate', 'advanced'].some(key => 
        levelsObj[key]?.content?.toLocaleLowerCase('tr-TR').includes(lowerQuery)
      );
      if (searchInLevels) return true;
    }
    
    // İçerikte ara (eski format - level 0 ve 1)
    if (topic.content?.level0_basic?.toLocaleLowerCase('tr-TR').includes(lowerQuery)) return true;
    if (topic.content?.level1_beginner?.toLocaleLowerCase('tr-TR').includes(lowerQuery)) return true;
    
    return false;
  });
}

// Önkoşul kontrolü
export function getPrerequisiteTopics(topicId: string): Topic[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  
  return topic.prerequisites
    .map(prereqId => getTopicById(prereqId))
    .filter((t): t is Topic => t !== undefined);
}

// Sonraki önerilen konular
export function getNextTopics(topicId: string): Topic[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  
  return topic.nextTopics
    .map(nextId => getTopicById(nextId))
    .filter((t): t is Topic => t !== undefined);
}

// İlişkili konular
export function getRelatedTopics(topicId: string): Topic[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  
  return (topic.relatedTopics || [])
    .map(relatedId => getTopicById(relatedId))
    .filter((t): t is Topic => t !== undefined);
}

// Tamamlanmamış önkoşullar
export function getIncompletePrerequisites(
  topicId: string,
  completedTopics: string[]
): Topic[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  
  return topic.prerequisites
    .filter(prereqId => !completedTopics.includes(prereqId))
    .map(prereqId => getTopicById(prereqId))
    .filter((t): t is Topic => t !== undefined);
}

// Konu kilidini kontrol et
export function isTopicUnlocked(
  topicId: string,
  completedTopics: string[]
): boolean {
  const topic = getTopicById(topicId);
  if (!topic) return false;
  
  // Önkoşulu yoksa kilitsiz
  if (topic.prerequisites.length === 0) return true;
  
  // Tüm önkoşullar tamamlandıysa kilitsiz
  return topic.prerequisites.every(prereqId => 
    completedTopics.includes(prereqId)
  );
}

// Önerilen bir sonraki konu
export function suggestNextTopic(completedTopics: string[]): Topic | null {
  // Kilidi açık ve henüz tamamlanmamış konuları bul
  const available = topics.filter(topic => 
    !completedTopics.includes(topic.id) &&
    isTopicUnlocked(topic.id, completedTopics)
  );
  
  if (available.length === 0) return null;
  
  // En düşük seviyeli ve en az ön koşulu olanı öner
  available.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.prerequisites.length - b.prerequisites.length;
  });
  
  return available[0];
}

// Öğrenme yolu oluştur
export function buildLearningPath(startTopicId: string): Topic[] {
  const path: Topic[] = [];
  const visited = new Set<string>();
  
  function addTopicAndPrerequisites(topicId: string) {
    if (visited.has(topicId)) return;
    
    const topic = getTopicById(topicId);
    if (!topic) return;
    
    visited.add(topicId);
    
    // Önce ön koşulları ekle
    topic.prerequisites.forEach(prereqId => {
      addTopicAndPrerequisites(prereqId);
    });
    
    // Sonra kendini ekle
    path.push(topic);
  }
  
  addTopicAndPrerequisites(startTopicId);
  return path;
}

// İstatistikler
export function getTopicStats() {
  return {
    total: topics.length,
    byCategory: Array.from(getTopicsByCategory().entries()).map(([category, topics]) => ({
      category,
      count: topics.length,
    })),
    byLevel: [0, 1, 2, 3, 4].map(level => ({
      level,
      count: topics.filter(t => t.level === level).length,
    })),
  };
}
