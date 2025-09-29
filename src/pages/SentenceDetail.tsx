import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { posDictionary } from '@/lib/posDictionary';
import { featuresDictionary } from '@/lib/featuresDictionary';
import { fetchSentenceDetail, updateSentence } from '@/lib/api';

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

  const fetchSentenceData = async () => {
    setLoading(true);
    try {
      const response = await fetchSentenceDetail(Number(id));

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
      fetchSentenceData();
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

      const response = await updateSentence(Number(id), payload);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">№</TableHead>
                <TableHead className="text-foreground">Форма</TableHead>
                <TableHead className="text-foreground">Лемма</TableHead>
                <TableHead className="text-foreground">Сөз түркүмдөрү</TableHead>
                <TableHead className="text-foreground">Белгилер</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentence.tokens.map((token, tokenIndex) => (
                <TableRow key={token.id}>
                  <TableCell className="text-foreground font-medium">
                    {token.token_index}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={token.form}
                      onChange={(e) => updateToken(tokenIndex, 'form', e.target.value)}
                      className="min-w-[120px] bg-background text-foreground border-border"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={token.lemma}
                      onChange={(e) => updateToken(tokenIndex, 'lemma', e.target.value)}
                      className="min-w-[120px] bg-background text-foreground border-border"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={token.pos}
                      onValueChange={(value) => {
                        updateToken(tokenIndex, 'pos', value);
                        updateToken(tokenIndex, 'xpos', value.toLowerCase());
                      }}
                    >
                      <SelectTrigger className="min-w-[150px] bg-background text-foreground border-border">
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
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[200px]">
                      {/* Display existing features */}
                      {Object.entries(token.feats).map(([featureKey, featureValue]) => {
                        const posFeatures = featuresDictionary[token.pos as keyof typeof featuresDictionary];
                        const feature = posFeatures?.[featureKey] as Feature | undefined;
                        
                        return (
                          <div key={featureKey} className="flex items-center space-x-1">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">
                                {feature?.label || featureKey}
                              </Label>
                              <Select
                                value={featureValue}
                                onValueChange={(value) => updateFeature(tokenIndex, featureKey, value)}
                              >
                                <SelectTrigger className="h-8 text-xs bg-background text-foreground border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {feature && Object.entries(feature.values).map(([key, value]) => (
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
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        );
                      })}
                      
                      {/* Add new feature buttons */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {featuresDictionary[token.pos as keyof typeof featuresDictionary] && 
                          Object.entries(featuresDictionary[token.pos as keyof typeof featuresDictionary] as Record<string, Feature>).map(([featureKey, feature]) => {
                            if (token.feats[featureKey]) return null; // Skip if already exists
                            
                            return (
                              <Select
                                key={featureKey}
                                onValueChange={(value) => updateFeature(tokenIndex, featureKey, value)}
                              >
                                <SelectTrigger className="h-6 text-xs min-w-[100px]">
                                  <SelectValue placeholder={`+ ${feature.label}`} />
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentenceDetailPage;