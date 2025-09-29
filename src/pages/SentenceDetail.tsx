import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { posDictionary } from '@/lib/posDictionary';
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

interface SentenceDetail {
  id: number;
  text: string;
  is_corrected: number;
  tokens: Token[];
}

const SentenceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sentence, setSentence] = useState<SentenceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSentenceDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/tagging/sentences/${id}`, {
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

  const updateToken = (tokenIndex: number, field: string, value: string) => {
    if (!sentence) return;

    const updatedTokens = sentence.tokens.map((token, index) => {
      if (index === tokenIndex) {
        if (field === 'feats') {
          return { ...token, feats: JSON.parse(value) };
        }
        return { ...token, [field]: value };
      }
      return token;
    });

    setSentence({ ...sentence, tokens: updatedTokens });
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

      const response = await fetch(`http://127.0.0.1:8000/tagging/sentences/${id}`, {
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
    <div className="space-y-6">
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
            {sentence.tokens.map((token, tokenIndex) => (
              <div key={token.id} className="border border-border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label>Индекс</Label>
                    <Input value={token.token_index} disabled />
                  </div>
                  
                  <div>
                    <Label>Форма</Label>
                    <Input
                      value={token.form}
                      onChange={(e) => updateToken(tokenIndex, 'form', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Лемма</Label>
                    <Input
                      value={token.lemma}
                      onChange={(e) => updateToken(tokenIndex, 'lemma', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Сөз туркумдору</Label>
                    <Select 
                      value={token.pos} 
                      onValueChange={(value) => {
                        updateToken(tokenIndex, 'pos', value);
                        updateToken(tokenIndex, 'xpos', value.toLowerCase());
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(posDictionary).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Признаки (Features)</Label>
                  
                  {/* Display existing features */}
                  <div className="space-y-2">
                    {Object.entries(token.feats).map(([featureKey, featureValue]) => {
                      const posFeatures = featuresDictionary[token.pos as keyof typeof featuresDictionary];
                      const feature = posFeatures?.[featureKey] as Feature | undefined;
                      
                      return (
                        <div key={featureKey} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {feature?.label || featureKey}
                            </p>
                            <Select
                              value={featureValue}
                              onValueChange={(value) => updateFeature(tokenIndex, featureKey, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(feature.values).map(([key, value]) => (
                                  <SelectItem key={key} value={key}>
                                    {value as string}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(tokenIndex, featureKey)}
                          >
                            Удалить
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add new feature */}
                  <div className="border-t border-border pt-4">
                    <Label className="text-sm font-medium">Добавить новый признак</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {featuresDictionary[token.pos as keyof typeof featuresDictionary] && 
                        Object.entries(featuresDictionary[token.pos as keyof typeof featuresDictionary] as Record<string, Feature>).map(([featureKey, feature]) => {
                          if (token.feats[featureKey]) return null; // Skip if already exists
                          
                          return (
                            <Select
                              key={featureKey}
                              onValueChange={(value) => updateFeature(tokenIndex, featureKey, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={feature.label} />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(feature.values).map(([key, value]) => (
                                  <SelectItem key={key} value={key}>
                                    {value as string}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentenceDetailPage;