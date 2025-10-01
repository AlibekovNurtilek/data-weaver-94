import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Search, ChevronDown } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchSentences = useCallback(async (page: number, search?: string, status?: number) => {
    setLoading(true);
    try {
      const response = await apiFetchSentences(page, 16, search, status);

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
  }, [toast]);

  useEffect(() => {
    fetchSentences(currentPage, searchQuery, statusFilter);
  }, [currentPage, searchQuery, statusFilter, fetchSentences]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowClick = useCallback((id: number) => {
    navigate(`/sentences/${id}`);
  }, [navigate]);

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500);
  }, []);

  const handleStatusSelect = useCallback((value: number | undefined) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  }, []);

  const getStatusLabel = () => {
    if (statusFilter === undefined) return 'Бардыгы';
    if (statusFilter === 1) return 'Иштелгендер';
    if (statusFilter === 0) return 'Иштеле электер';
    return 'Бардыгы';
  };

  return (
    <div className="mt-8 max-w-[1500px] mx-auto">
      {/* Фильтры */}
      <div className="bg-dark-purple rounded-t-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          
          {/* Поиск */}
          <div className="relative max-w-[350px] md:w-[350px]">
            <Search className="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInput}
              placeholder="Издөө..."
              className="bg-transparent text-white w-full pr-8 text-lg py-1 border-b border-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Фильтр по статусу - Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 pl-4 pr-2  py-2  text-white rounded-lg hover:bg-white/10 transition-all duration-200 min-w-[100px] backdrop-blur-sm"
            >
              <span className="text-sm font-medium">{getStatusLabel()}</span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full min-w-[180px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleStatusSelect(undefined)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                    statusFilter === undefined ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Бардыгы
                </button>
                <button
                  onClick={() => handleStatusSelect(1)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors border-t border-gray-100 ${
                    statusFilter === 1 ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Иштелгендер
                </button>
                <button
                  onClick={() => handleStatusSelect(0)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors border-t border-gray-100 ${
                    statusFilter === 0 ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  Иштеле электер
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-card rounded-b-lg divide-y divide-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-purple text-white h-12">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold w-20">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Текст
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold w-12">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {loading && (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && sentences.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-дп text-gray-600">
                    Маалымат табылган жок
                  </td>
                </tr>
              )}

              {!loading && sentences.length > 0 && sentences.map((sentence, index) => (
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
                        <div className="flex items-center gap-2">
                          <div className='w-3 h-3 rounded-full bg-green-600'></div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className='w-3 h-3 rounded-full bg-red-700'></div>
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