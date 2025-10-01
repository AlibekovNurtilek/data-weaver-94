import { Input } from '@/components/ui/input';
import { ChevronDown, Edit } from 'lucide-react';
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

interface TokenRowProps {
  token: Token;
  displayPOS: string;
  onUpdateField: (field: string, value: string) => void;
  onOpenPOSSelector: () => void;
  onOpenFeatureSelector: () => void;
}

export const TokenRow = ({
  token,
  displayPOS,
  onUpdateField,
  onOpenPOSSelector,
  onOpenFeatureSelector,
}: TokenRowProps) => {
  const posFeatures = featuresDictionary[
    token.pos !== 'X' ? token.pos : token.xpos.toUpperCase() as keyof typeof featuresDictionary
  ] as Record<string, Feature> | undefined;

  // Проверяем есть ли признаки для данной части речи
  const hasAvailableFeatures = posFeatures && Object.keys(posFeatures).length > 0;
  const hasSelectedFeatures = token.feats && Object.keys(token.feats).length > 0;

  return (
    <tr className="border-b border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
      {/* ID */}
      <td className="px-4 py-3 text-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {token.token_index}
        </span>
      </td>

      {/* Форма */}
      <td className="px-4 py-3">
        <Input
          value={token.form}
          onChange={(e) => onUpdateField('form', e.target.value)}
          className="h-9 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
        />
      </td>

      {/* Лемма */}
      <td className="px-4 py-3">
        <Input
          value={token.lemma}
          onChange={(e) => onUpdateField('lemma', e.target.value)}
          className="h-9 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
        />
      </td>

      {/* Сөз түркүмү */}
      <td className="px-4 py-3">
        <button
          onClick={onOpenPOSSelector}
          className="w-full h-9 px-3 text-left border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors text-sm"
        >
          <span className="text-gray-900 dark:text-white">{displayPOS}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </td>

      {/* Касиеттер (Признаки) */}
      <td className="">
        <button
          onClick={hasAvailableFeatures ? onOpenFeatureSelector : undefined}
          disabled={!hasAvailableFeatures}
          className={`max-w-full min-h-[36px] px-3 py-2 text-left transition-colors ${
            !hasAvailableFeatures
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          }`}
        >
          {hasSelectedFeatures ? (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(token.feats).map(([featureKey, featureValue]) => {
                const feature = posFeatures?.[featureKey];
                return (
                  <span
                    key={featureKey}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded text-xs"
                  >
                    {/* <span className="font-medium text-gray-900 dark:text-white">
                      {feature?.label || featureKey}:
                    </span> */}
                    <span className="text-gray-900 font-medium dark:text-gray-300">
                      {feature?.values[featureValue] || featureValue}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : !hasAvailableFeatures ? (
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <span className="text-sm italic">Бул сөз түркүмү үчүн признактар жок</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Edit className="h-3.5 w-3.5" />
              <span className="text-sm">Касиеттерди тандаңыз</span>
            </div>
          )}
        </button>
      </td>
    </tr>
  );
};