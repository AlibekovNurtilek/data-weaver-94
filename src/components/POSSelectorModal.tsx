import { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { categories } from '../lib/categories';

interface POSSelectorModalProps {
  isOpen: boolean;
  currentValue: string;
  onSelect: (designation: string) => void;
  onClose: () => void;
}

export const POSSelectorModal = ({ isOpen, currentValue, onSelect, onClose }: POSSelectorModalProps) => {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const handleSelect = (designation: string) => {
    onSelect(designation);
    onClose();
  };

  const toggleCategory = (id: number) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderItem = (item: any, level: number = 0) => {
    if (item.designation) {
      return (
        <button
          key={item.id}
          onClick={() => handleSelect(item.designation)}
          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-sm transition-colors"
          style={{ paddingLeft: `${(level + 1) * 16}px` }}
        >
          {item.label}
        </button>
      );
    }

    const isOpen = openCategories.has(item.id);
    return (
      <div key={item.id}>
        <button
          onClick={() => toggleCategory(item.id)}
          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-sm font-medium transition-colors"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Сөз түркүмүн тандаңыз
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4">
          {categories.map((category) => renderItem(category))}
        </div>
      </div>
    </div>
  );
};