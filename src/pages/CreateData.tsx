import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { runTagging } from '@/lib/api';

const CreateData = () => {
  const navigate = useNavigate()
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/plain') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Неверный формат файла",
        description: "Пожалуйста, выберите txt файл",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Неверный формат файла",
        description: "Пожалуйста, выберите txt файл",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!textInput.trim() && !selectedFile) {
      toast({
        title: "Ошибка",
        description: "Введите текст или выберите файл",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('text_form', textInput);
      }
      
      formData.append('payload', '');

      const response = await runTagging(formData);

      if (response.ok) {
        const data = await response.json();
        // Clear form
        setTextInput('');
        setSelectedFile(null);
        navigate('/sentences')
      } else {
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при обработке данных",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке данных",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1500px] m-auto h-screen  mt-20">
      <Card className='w-full'>
        <CardHeader className='flex flex-col justify-center items-center'>
          <CardTitle className="text-foreground">Жаңы маалымат түзүү</CardTitle>
          <p className="text-sm text-muted-foreground">
            Тестти жазыңыз же болбосо txt файл жүктөңүз
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text-input">Анализ үчүн текст жазыңыз</Label>
              <Textarea
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Форфологиялык анализ үчүн текст жазыңыз"
                className="min-h-32"
              />
            </div>

            <div className="space-y-4">
              <Label>Же болбосо txt файл киргизиңиз</Label>
              
              {/* File input */}
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept=".txt"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
              </div>

              {/* Drag and drop area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-foreground">Файлды жүктөңүз...</p>
                ) : (
                  <div>
                    <p className="text-foreground mb-2">
                      Файлды алып келиңиз же болбосо бул жерге басыңыз
                    </p>
                    <p className="text-sm text-muted-foreground">
                      txt форматындагы файлдар гана
                    </p>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="flex items-center space-x-2 p-3 bg-accent rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">{selectedFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Өчүрүү
                  </Button>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Иштелүүдө..." : "Маалыматты сактоо"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateData;