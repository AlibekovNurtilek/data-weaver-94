import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchSentences as apiFetchSentences } from '@/lib/api';

interface Sentence {
  id: number;
  text: string;
  is_corrected: number;
}

interface SentencesResponse {
  meta: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };
  items: Sentence[];
}

const Sentences = () => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [meta, setMeta] = useState<SentencesResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchSentences = async (page: number) => {
    setLoading(true);
    try {
      const response = await apiFetchSentences(page, 20);

      if (response.ok) {
        const data: SentencesResponse = await response.json();
        setSentences(data.items);
        setMeta(data.meta);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить предложения",
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
    fetchSentences(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSentenceClick = (id: number) => {
    navigate(`/sentences/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Список предложений</CardTitle>
          {meta && (
            <p className="text-sm text-muted-foreground">
              Всего: {meta.total_items} предложений
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sentences.map((sentence) => (
              <div
                key={sentence.id}
                onClick={() => handleSentenceClick(sentence.id)}
                className="p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-1">
                      ID: {sentence.id}
                    </p>
                    <p className="text-foreground">{sentence.text}</p>
                  </div>
                  <div className="ml-4">
                    <Badge
                      variant={sentence.is_corrected ? "default" : "secondary"}
                      className={
                        sentence.is_corrected
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {sentence.is_corrected ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {sentence.is_corrected ? "Исправлено" : "Не исправлено"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Страница {meta.current_page} из {meta.total_pages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta.total_pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sentences;