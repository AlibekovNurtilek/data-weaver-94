import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, X } from 'lucide-react';
import { featuresDictionary } from '@/lib/featuresDictionary';

interface Feature {
  label: string;
  values: Record<string, string>;
}

interface Token {
  id: number;
  token_index: string;
  form: string;
  lemma: string;
  pos: string;
  xpos: string;
  feats: Record<string, string>;
}

interface TokenCardProps {
  token: Token;
  displayPOS: string;
  onUpdateField: (field: string, value: string) => void;
  onOpenPOSSelector: () => void;
  onOpenFeatureSelector: () => void;
  onRemoveFeature: (key: string) => void;
}

export const TokenCard = ({
  token,
  displayPOS,
  onUpdateField,
  onOpenPOSSelector,
  onOpenFeatureSelector,
  onRemoveFeature,
}: TokenCardProps) => {
  const posFeatures = featuresDictionary[
    token.pos !== 'X' ? token.pos : token.xpos.toUpperCase() as keyof typeof featuresDictionary
  ] as Record<string, Feature> | undefined;

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            Индекс
          </Label>
          <Input
            value={token.token_index}
            disabled
            className="bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            Форма
          </Label>
          <Input
            value={token.form}
            onChange={(e) => onUpdateField('form', e.target.value)}
            className="border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            Лемма
          </Label>
          <Input
            value={token.lemma}
            onChange={(e) => onUpdateField('lemma', e.target.value)}
            className="border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            Сөз түркүмдөрү
          </Label>
          <button
            onClick={onOpenPOSSelector}
            className="w-full px-3 py-2 text-left border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
          >
            <span className="text-sm text-gray-900 dark:text-white">{displayPOS}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          Признаки (Features)
        </Label>

        {Object.keys(token.feats).length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            {Object.entries(token.feats).map(([featureKey, featureValue]) => {
              const feature = posFeatures?.[featureKey];

              return (
                <div
                  key={featureKey}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-md shadow-sm"
                >
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {feature?.label || featureKey}:
                    </span>
                    <span className="ml-1 text-gray-700 dark:text-gray-300">
                      {feature?.values[featureValue] || featureValue}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveFeature(featureKey)}
                    className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onOpenFeatureSelector}
          className="w-full px-4 py-3 text-left border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
        >
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            + Добавить признак
          </span>
        </button>
      </div>
    </div>
  );
};