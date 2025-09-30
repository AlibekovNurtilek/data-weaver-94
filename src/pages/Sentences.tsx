import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchSentences as apiFetchSentences } from '@/lib/api';
import Pagination from '@/components/Pagination';

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
      const response = await apiFetchSentences(page, 16);

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

  const handleRowClick = (id: number) => {
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
    <div className="space-y-4">
      <div className="bg-card rounded-lg divide-y divide-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black text-white h-12">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold w-20">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Текст
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold w-48">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {sentences.map((sentence, index) => (
                <tr
                  key={sentence.id}
                  onClick={() => handleRowClick(sentence.id)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-200'
                  }`}
                >
                  <td className="px-6 py-[10px] text-sm text-gray-900">
                    {sentence.id}
                  </td>
                  <td className="px-6 py-[10px] text-sm text-gray-900">
                    {sentence.text}
                  </td>
                  <td className="px-6 py-[10px]">
                    <div className="flex items-center justify-center">
                      {sentence.is_corrected ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && (
          <div className="px-6 py-4 bg-transparent">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Жалпы: {meta.total_items} сүйлөм
              </p>
              <p className="text-sm text-gray-600">
                Барак {meta.current_page} / {meta.total_pages}
              </p>
            </div>
            {meta.total_pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={meta.total_pages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sentences;