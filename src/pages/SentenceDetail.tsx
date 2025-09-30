import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useToken } from '@/hooks/useToken';
import { fetchSentenceDetail, updateSentence } from '@/lib/api';
import { POSSelectorModal } from '@/components/POSSelectorModal';
import { FeatureSelectorModal } from '@/components/FeatureSelectorModal';
import { TokenCard } from '@/components/TokenCard';

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
  const { getDisplayPOS, preparePOSUpdate } = useToken();

  const [sentence, setSentence] = useState<SentenceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activePOSModal, setActivePOSModal] = useState<number | null>(null);
  const [activeFeatureModal, setActiveFeatureModal] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadSentenceDetail();
    }
  }, [id]);

  const loadSentenceDetail = async () => {
    setLoading(true);
    try {
      const response = await fetchSentenceDetail(Number(id));

      if (response.ok) {
        const data = await response.json();
        setSentence(data);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить детали предложения',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при загрузке данных',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTokenField = (tokenIndex: number, field: string, value: string) => {
    if (!sentence) return;

    const updatedTokens = sentence.tokens.map((token, index) =>
      index === tokenIndex ? { ...token, [field]: value } : token
    );

    setSentence({ ...sentence, tokens: updatedTokens });
  };

  const handlePOSSelect = (tokenIndex: number, designation: string) => {
    if (!sentence) return;

    const currentToken = sentence.tokens[tokenIndex];
    const posUpdate = preparePOSUpdate(designation, currentToken);

    const updatedTokens = sentence.tokens.map((token, index) =>
      index === tokenIndex ? { ...token, ...posUpdate } : token
    );

    setSentence({ ...sentence, tokens: updatedTokens });
    setActivePOSModal(null);
  };

  const updateFeature = (tokenIndex: number, featureKey: string, featureValue: string) => {
    if (!sentence) return;

    const updatedTokens = sentence.tokens.map((token, index) =>
      index === tokenIndex
        ? { ...token, feats: { ...token.feats, [featureKey]: featureValue } }
        : token
    );

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
    return sentence.tokens.map((token) => token.form).join(' ');
  };

  const handleSave = async () => {
    if (!sentence) return;

    setSaving(true);
    try {
      const payload = {
        id: sentence.id,
        sentence_text: getDisplayText(),
        is_corrected: sentence.is_corrected,
        tokens: sentence.tokens,
      };

      const response = await updateSentence(Number(id), payload);

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Изменения сохранены',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось сохранить изменения',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при сохранении',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sentence) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Предложение не найдено</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/sentences')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Предложение ID: {sentence.id}
        </h1>
      </div>

      <Card className="border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Текст предложения</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-900 dark:text-white p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {getDisplayText()}
          </p>
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Токены</CardTitle>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sentence.tokens.map((token, tokenIndex) => (
              <TokenCard
                key={token.id}
                token={token}
                displayPOS={getDisplayPOS(token)}
                onUpdateField={(field, value) => updateTokenField(tokenIndex, field, value)}
                onOpenPOSSelector={() => setActivePOSModal(tokenIndex)}
                onOpenFeatureSelector={() => setActiveFeatureModal(tokenIndex)}
                onRemoveFeature={(key) => removeFeature(tokenIndex, key)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* POS Selector Modal */}
      {activePOSModal !== null && (
        <POSSelectorModal
          isOpen={true}
          currentValue={sentence.tokens[activePOSModal].pos}
          onSelect={(designation) => handlePOSSelect(activePOSModal, designation)}
          onClose={() => setActivePOSModal(null)}
        />
      )}

      {/* Feature Selector Modal */}
      {activeFeatureModal !== null && (
        <FeatureSelectorModal
          isOpen={true}
          tokenPos={
            sentence.tokens[activeFeatureModal].pos !== 'X'
              ? sentence.tokens[activeFeatureModal].pos
              : sentence.tokens[activeFeatureModal].xpos.toUpperCase()
          }
          existingFeats={sentence.tokens[activeFeatureModal].feats}
          onSelect={(key, value) => updateFeature(activeFeatureModal, key, value)}
          onRemove={(key) => removeFeature(activeFeatureModal, key)}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}
    </div>
  );
};

export default SentenceDetailPage;