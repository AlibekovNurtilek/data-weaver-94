import { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { featuresDictionary } from '@/lib/featuresDictionary';

interface Feature {
  label: string;
  values: Record<string, string>;
}

interface FeatureSelectorModalProps {
  isOpen: boolean;
  tokenPos: string;
  existingFeats: Record<string, string>;
  onSelect: (key: string, value: string) => void;
  onRemove: (key: string) => void;
  onClose: () => void;
}

export const FeatureSelectorModal = ({
  isOpen,
  tokenPos,
  existingFeats,
  onSelect,
  onRemove,
  onClose,
}: FeatureSelectorModalProps) => {
  const [openFeature, setOpenFeature] = useState<string | null>(null);

  if (!isOpen) return null;

  const posFeatures = featuresDictionary[tokenPos as keyof typeof featuresDictionary] as Record<string, Feature> | undefined;

  const toggleFeature = (key: string) => {
    setOpenFeature(openFeature === key ? null : key);
  };

  const handleSelect = (featureKey: string, valueKey: string) => {
    onSelect(featureKey, valueKey);
    setOpenFeature(null);
  };

  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col  mx-2">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Касиеттерди тандаңыз
          </h3>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {!posFeatures ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Бул сөз түркүмү үчүн касиеттер жок
            </p>
          ) : (
            <>
              {/* Selected features */}
              {Object.keys(existingFeats).length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(existingFeats).map(([key, value]) => {
                      const feature = posFeatures[key];
                      return (
                        <div
                          key={key}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-md shadow-sm"
                        >
                          <div className="text-sm">
                            {/* <span className="font-medium text-gray-900 dark:text-white">
                              {feature?.label || key}:
                            </span> */}
                            <span className="ml-1 font-medium text-gray-900 dark:text-gray-300">
                              {feature?.values[value] || value}
                            </span>
                          </div>
                          <button
                            onClick={() => onRemove(key)}
                            className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          >
                            <X className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available features */}
              <div className="space-y-2">
                {Object.entries(posFeatures).map(([featureKey, feature]) => {
                  const isOpen = openFeature === featureKey;
                  return (
                    <div key={featureKey} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFeature(featureKey)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {feature.label}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="bg-white dark:bg-slate-900 p-2">
                          {Object.entries(feature.values).map(([valueKey, valueLabel]) => (
                            <button
                              key={valueKey}
                              onClick={() => handleSelect(featureKey, valueKey)}
                              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-sm transition-colors"
                            >
                              {valueLabel}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Save button at the bottom */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
          >
            Сактоо
          </button>
        </div>
      </div>
    </div>
  );
};