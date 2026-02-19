import { useState } from 'react';
import {
  EMOTIONS,
  EmotionKey,
  EMOTION_KEYS,
  MAX_EMOTIONS,
} from '@/types/emotions';
import { Slider } from '@/components/ui/slider';

interface EmotionSelectorProps {
  selectedEmotions: string[];
  primaryEmotion: string | null;
  emotionIntensities: Record<string, number>;
  onEmotionsChange: (emotions: string[]) => void;
  onPrimaryEmotionChange: (emotion: string | null) => void;
  onIntensitiesChange: (intensities: Record<string, number>) => void;
}

export const EmotionSelector = ({
  selectedEmotions,
  primaryEmotion,
  emotionIntensities,
  onEmotionsChange,
  onPrimaryEmotionChange,
  onIntensitiesChange,
}: EmotionSelectorProps) => {
  const toggleEmotion = (emotion: EmotionKey) => {
    if (selectedEmotions.includes(emotion)) {
      // 取消選擇
      const newEmotions = selectedEmotions.filter((e) => e !== emotion);
      onEmotionsChange(newEmotions);

      // 移除強度記錄
      const newIntensities = { ...emotionIntensities };
      delete newIntensities[emotion];
      onIntensitiesChange(newIntensities);

      // 如果是主要情緒，也清除
      if (emotion === primaryEmotion) {
        onPrimaryEmotionChange(null);
      }
    } else {
      // 新增選擇（最多 3 個）
      if (selectedEmotions.length < MAX_EMOTIONS) {
        onEmotionsChange([...selectedEmotions, emotion]);

        // 新增預設強度 (5 = 中等)
        onIntensitiesChange({
          ...emotionIntensities,
          [emotion]: 5,
        });

        // 第一個自動設為主要情緒
        if (selectedEmotions.length === 0) {
          onPrimaryEmotionChange(emotion);
        }
      }
    }
  };

  const updateIntensity = (emotion: string, intensity: number) => {
    onIntensitiesChange({
      ...emotionIntensities,
      [emotion]: intensity,
    });
  };

  const setPrimaryEmotion = (emotion: string) => {
    onPrimaryEmotionChange(emotion === primaryEmotion ? null : emotion);
  };

  return (
    <div className="space-y-6">
      {/* 第一步：選擇情緒 */}
      <div>
        <label className="text-sm font-semibold mb-3 block">
          今天的情緒（最多 {MAX_EMOTIONS} 個）
        </label>

        {selectedEmotions.length >= MAX_EMOTIONS && (
          <p className="text-xs text-orange-600 mb-2">
            ⚠️ 已達上限，請移除一個情緒後再選擇其他
          </p>
        )}

        <div className="grid grid-cols-4 gap-2">
          {EMOTION_KEYS.map((emotionKey) => {
            const emotion = EMOTIONS[emotionKey];
            const isSelected = selectedEmotions.includes(emotionKey);
            const canSelect =
              isSelected || selectedEmotions.length < MAX_EMOTIONS;

            return (
              <button
                key={emotionKey}
                onClick={() => canSelect && toggleEmotion(emotionKey)}
                disabled={!canSelect}
                className={`p-3 rounded-lg transition-all ${
                  isSelected
                    ? `text-white`
                    : canSelect
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                }`}
                style={isSelected ? { backgroundColor: emotion.color } : {}}
              >
                <div className="text-2xl">{emotion.emoji}</div>
                <div className="text-xs mt-1">{emotion.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 第二步：設定強度 */}
      {selectedEmotions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="text-sm font-semibold mb-3 block">
            情緒強度設定
          </label>

          <div className="space-y-4">
            {selectedEmotions.map((emotion) => {
              const emotionData = EMOTIONS[emotion as EmotionKey];
              const intensity = emotionIntensities[emotion] || 5;

              return (
                <div key={emotion} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">
                      {emotionData.emoji} {emotionData.name}
                    </label>
                    <span className="text-xs font-bold">{intensity}/10</span>
                  </div>
                  <Slider
                    value={[intensity]}
                    onValueChange={(value) =>
                      updateIntensity(emotion, value[0])
                    }
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                    trackClassName="border border-black bg-slate-200 h-4 rounded-sm"
                    rangeClassName="bg-white border-r border-black"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 第三步：選擇主要情緒 */}
      {selectedEmotions.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <label className="text-sm font-semibold mb-3 block">
            選擇主要情緒
          </label>

          <div className="space-y-2">
            {selectedEmotions.map((emotion) => {
              const emotionData = EMOTIONS[emotion as EmotionKey];
              const intensity = emotionIntensities[emotion] || 5;
              const isPrimary = primaryEmotion === emotion;

              return (
                <button
                  key={emotion}
                  onClick={() => setPrimaryEmotion(emotion)}
                  className={`w-full p-3 rounded-lg text-left transition-all flex justify-between items-center ${
                    isPrimary
                      ? 'ring-2 ring-yellow-400'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                  style={
                    isPrimary
                      ? { backgroundColor: emotionData.color + '20' }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{emotionData.emoji}</span>
                    <span className="font-medium">{emotionData.name}</span>
                    <span className="text-xs text-gray-500">
                      ({intensity}/10)
                    </span>
                  </div>
                  <span className="text-xl">{isPrimary ? '★' : '○'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
