import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { posDictionary } from '@/lib/posDictionary';
import { featuresDictionary } from '@/lib/featuresDictionary';

const customTags = ['TTSOZ', 'ETSOZ', 'ISSOZ', 'ASSOZ', 'TTSSOZ'];

const categories = [
  {
    id: 1,
    label: "Маани берүүчү",
    children: [
      {
        id: 11,
        label: "Зат атооч",
        children: [
          { id: 111, label: "Зат атооч", designation: "NOUN" },
          { id: 112, label: "Ээнчилүү зат атооч", designation: "PROPN" },
        ],
      },
      { id: 12, label: "Сын атооч", designation: "ADJ" },
      { id: 13, label: "Ат атооч", designation: "PRON" },
      { id: 14, label: "Сан атооч", designation: "NUM" },
      {
        id: 15,
        label: "Этиш",
        children: [
          { id: 151, label: "Этиш", designation: "VERB" },
          { id: 152, label: "Көмөкчү этиш", designation: "AUX" },
        ],
      },
      { id: 16, label: "Тактооч", designation: "ADV" },
    ],
  },
  {
    id: 2,
    label: "Маани бербөөчү же кызматчы",
    children: [
      { id: 21, label: "Байламта", designation: "CCONJ" },
      { id: 22, label: "Жандооч", designation: "SCONJ" },
      { id: 23, label: "Бөлүкчө", designation: "PART" },
      { id: 24, label: "Модалдык сөз", designation: "INTJ" },
    ],
  },
  {
    id: 3,
    label: "Өзгөчө сөз түркүмдөрү",
    children: [
      {
        id: 31,
        label: "Тууранды сөз",
        children: [
          { id: 311, label: "Табыш тууранды сөз", designation: "TTSOZ" },
          { id: 312, label: "Элес тууранды сөз", designation: "ETSOZ" },
        ],
      },
      {
        id: 32,
        label: "Сырдык сөз",
        children: [
          { id: 321, label: "Ички сезимди билдирүүчү", designation: "ISSOZ" },
          { id: 322, label: "Айбанаттарга карата айтылуучу", designation: "ASSOZ" },
          { id: 323, label: "Турмуш тиричиликте колдонулуучу", designation: "TTSSOZ" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Башка...",
    children: [
      { id: 41, label: "Атоочтук", designation: "ATOOCH" },
      { id: 42, label: "Кыймыл атооч", designation: "KTOOCH" },
      { id: 43, label: "Тыныш белгиси", designation: "PUNCT" },
      { id: 44, label: "Символ", designation: "SYM" },
    ],
  },
];

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

interface SentenceDetail {
  id: number;
  text: string;
  is_corrected: number;
  tokens: Token[];
}

const POSSelector = ({ value, onSelect, onClose }: { value: string; onSelect: (designation: string) => void; onClose: () => void }) => {
  const [openCategory, setOpenCategory] = useState<number | null>(null);

  const handleSelect = (designation: string) => {
    onSelect(designation);
    onClose();
  };

  const toggleCategory = (id: number) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const renderItem = (item: any, level: number = 0) => {
    if (item.designation) {
      return (
        <button
          key={item.id}
          onClick={() => handleSelect(item.designation)}
          className="w-full text-left px-4 py-2 hover:bg-accent rounded-md text-sm"
          style={{ paddingLeft: `${(level + 1) * 16}px` }}
        >
          {item.label}
        </button>
      );
    }

    const isOpen = openCategory === item.id;
    return (
      <div key={item.id}>
        <button
          onClick={() => toggleCategory(item.id)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent rounded-md text-sm font-medium"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <span>{item.label}</span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isOpen && item.children && (
          <div className="mt-1">
            {item.children.map((child: any) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="absolute z-50 mt-2 w-full bg-popover border border-border rounded-md shadow-lg max-h-96 overflow-y-auto">
      <div className="p-2">
        {categories.map((category) => renderItem(category))}
      </div>
    </div>
  );
};

const FeatureSelector = ({ 
  tokenPos, 
  existingFeats, 
  onSelect, 
  onClose 
}: { 
  tokenPos: string; 
  existingFeats: Record<string, string>; 
  onSelect: (key: string, value: string) => void; 
  onClose: () => void;
}) => {
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const posFeatures = featuresDictionary[tokenPos as keyof typeof featuresDictionary] as Record<string, Feature> | undefined;

  if (!posFeatures) {
    return (
      <div className="absolute z-50 mt-2 w-full bg-popover border border-border rounded-md shadow-lg p-4">
        <p className="text-sm text-muted-foreground">Бул сөз түркүмү үчүн признактар жок</p>
      </div>
    );
  }

  const toggleFeature = (key: string) => {
    setOpenFeature(openFeature === key ? null : key);
  };

  const handleSelect = (featureKey: string, valueKey: string) => {
    onSelect(featureKey, valueKey);
    setOpenFeature(null);
  };

  return (
    <div className="absolute z-50 mt-2 w-full bg-popover border border-border rounded-md shadow-lg max-h-96 overflow-y-auto">
      {/* Selected features at top */}
      {Object.keys(existingFeats).length > 0 && (
        <div className="p-3 border-b border-border max-h-32 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {Object.entries(existingFeats).map(([key, value]) => {
              const feature = posFeatures[key];
              return (
                <div key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 rounded-md text-xs">
                  <span className="font-medium">{feature?.label || key}:</span>
                  <span>{feature?.values[value] || value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Available features */}
      <div className="p-2">
        {Object.entries(posFeatures).map(([featureKey, feature]) => {
          const isOpen = openFeature === featureKey;
          return (
            <div key={featureKey} className="mb-1">
              <button
                onClick={() => toggleFeature(featureKey)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md text-sm font-medium"
              >
                <span>{feature.label}</span>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isOpen && (
                <div className="mt-1 ml-2">
                  {Object.entries(feature.values).map(([valueKey, valueLabel]) => (
                    <button
                      key={valueKey}
                      onClick={() => handleSelect(featureKey, valueKey)}
                      className="w-full text-left px-4 py-2 hover:bg-accent rounded-md text-sm"
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
    </div>
  );
};

const SentenceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sentence, setSentence] = useState<SentenceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activePOSSelector, setActivePOSSelector] = useState<number | null>(null);
  const [activeFeatureSelector, setActiveFeatureSelector] = useState<number | null>(null);

  const fetchSentenceDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/tagging/sentences/${id}`, {
        credentials: 'include',
        headers: { 'accept': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setSentence(data);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить детали предложения",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при загрузке данных",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSentenceDetail();
    }
  }, [id]);

  const getDisplayPOS = (token: Token) => {
    if (token.pos !== 'X' && !customTags.includes(token.pos)) {
      return posDictionary[token.pos as keyof typeof posDictionary] || token.pos;
    } else {
      const xposUpper = token.xpos.toUpperCase();
      return posDictionary[xposUpper as keyof typeof posDictionary] || xposUpper;
    }
  };

  const updateToken = (tokenIndex: number, field: string, value: string) => {
    if (!sentence) return;

    const updatedTokens = sentence.tokens.map((token, index) => {
      if (index === tokenIndex) {
        return { ...token, [field]: value };
      }
      return token;
    });

    setSentence({ ...sentence, tokens: updatedTokens });
  };

  const handlePOSSelect = (tokenIndex: number, designation: string) => {
    if (!sentence) return;

    const updatedTokens = sentence.tokens.map((token, index) => {
      if (index === tokenIndex) {
        if (customTags.includes(designation)) {
          return { ...token, pos: 'X', xpos: designation.toLowerCase() };
        } else {
          return { ...token, pos: designation.toUpperCase(), xpos: designation.toLowerCase() };
        }
      }
      return token;
    });

    setSentence({ ...sentence, tokens: updatedTokens });
    setActivePOSSelector(null);
  };

  const updateFeature = (tokenIndex: number, featureKey: string, featureValue: string) => {
    if (!sentence) return;

    const updatedTokens = sentence.tokens.map((token, index) => {
      if (index === tokenIndex) {
        return {
          ...token,
          feats: { ...token.feats, [featureKey]: featureValue }
        };
      }
      return token;
    });

    setSentence({ ...sentence, tokens: updatedTokens });
  };

  const removeFeature = (tokenIndex: number, featureKey: string) => {
    if (!sentence) return;

    const updatedTokens = sentence.tokens.map((token, index) => {
      if (index === tokenIndex) {
        const newFeats = { ...token.feats };
        delete newFeats[featureKey];
        return { ...token, feats: newFeats };
      }
      return token;
    });

    setSentence({ ...sentence, tokens: updatedTokens });
  };

  const getDisplayText = () => {
    if (!sentence) return '';
    return sentence.tokens.map(token => token.form).join(' ');
  };

  const handleSave = async () => {
    if (!sentence) return;

    setSaving(true);
    try {
      const payload = {
        id: sentence.id,
        sentence_text: getDisplayText(),
        is_corrected: sentence.is_corrected,
        tokens: sentence.tokens
      };

      const response = await fetch(`http://localhost:8000/tagging/sentences/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Изменения сохранены",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить изменения",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!sentence) {
    return <div>Предложение не найдено</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/sentences')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          Предложение ID: {sentence.id}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Текст предложения</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground p-4 bg-muted rounded-lg">
            {getDisplayText()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Токены</CardTitle>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sentence.tokens.map((token, tokenIndex) => {
              const posFeatures = featuresDictionary[token.pos !== 'X' ? token.pos : token.xpos.toUpperCase() as keyof typeof featuresDictionary] as Record<string, Feature> | undefined;
              
              return (
                <div key={token.id} className="border border-border rounded-lg p-6 bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Индекс</Label>
                      <Input value={token.token_index} disabled className="bg-muted" />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Форма</Label>
                      <Input
                        value={token.form}
                        onChange={(e) => updateToken(tokenIndex, 'form', e.target.value)}
                        className="border-border"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Лемма</Label>
                      <Input
                        value={token.lemma}
                        onChange={(e) => updateToken(tokenIndex, 'lemma', e.target.value)}
                        className="border-border"
                      />
                    </div>
                    
                    <div className="relative">
                      <Label className="text-sm font-medium mb-2 block">Сөз түркүмдөрү</Label>
                      <button
                        onClick={() => setActivePOSSelector(activePOSSelector === tokenIndex ? null : tokenIndex)}
                        className="w-full px-3 py-2 text-left border border-border rounded-md bg-background hover:bg-accent flex items-center justify-between"
                      >
                        <span className="text-sm">{getDisplayPOS(token)}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {activePOSSelector === tokenIndex && (
                        <POSSelector
                          value={token.pos}
                          onSelect={(designation) => handlePOSSelect(tokenIndex, designation)}
                          onClose={() => setActivePOSSelector(null)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Признаки (Features)</Label>
                    
                    {Object.keys(token.feats).length > 0 && (
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-muted/50 rounded-lg border border-border">
                        {Object.entries(token.feats).map(([featureKey, featureValue]) => {
                          const feature = posFeatures?.[featureKey];
                          
                          return (
                            <div key={featureKey} className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-md">
                              <div className="text-sm">
                                <span className="font-medium text-foreground">{feature?.label || featureKey}:</span>
                                <span className="ml-1 text-foreground">{feature?.values[featureValue] || featureValue}</span>
                              </div>
                              <button
                                onClick={() => removeFeature(tokenIndex, featureKey)}
                                className="p-0.5 hover:bg-destructive/20 rounded"
                              >
                                <X className="h-3 w-3 text-destructive" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="relative">
                      <button
                        onClick={() => setActiveFeatureSelector(activeFeatureSelector === tokenIndex ? null : tokenIndex)}
                        className="w-full px-4 py-3 text-left border-2 border-dashed border-border rounded-md bg-background hover:bg-accent hover:border-primary/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-muted-foreground">+ Добавить признак</span>
                      </button>
                      {activeFeatureSelector === tokenIndex && (
                        <FeatureSelector
                          tokenPos={token.pos !== 'X' ? token.pos : token.xpos.toUpperCase()}
                          existingFeats={token.feats}
                          onSelect={(key, value) => updateFeature(tokenIndex, key, value)}
                          onClose={() => setActiveFeatureSelector(null)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentenceDetailPage;