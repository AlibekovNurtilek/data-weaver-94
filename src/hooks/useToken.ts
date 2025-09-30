import { posDictionary } from '@/lib/posDictionary';
import { customTags } from '@/lib/categories';

interface Token {
  id: number;
  token_index: string;
  form: string;
  lemma: string;
  pos: string;
  xpos: string;
  feats: Record<string, string>;
}

export const useToken = () => {
  const getDisplayPOS = (token: Token): string => {
    if (token.pos !== 'X' && !customTags.includes(token.pos)) {
      return posDictionary[token.pos as keyof typeof posDictionary] || token.pos;
    } else {
      const xposUpper = token.xpos.toUpperCase();
      return posDictionary[xposUpper as keyof typeof posDictionary] || xposUpper;
    }
  };

  const preparePOSUpdate = (designation: string, currentToken: Token): Partial<Token> => {
    // ВАЖНО: При смене POS сбрасываем все признаки!
    if (customTags.includes(designation)) {
      return { 
        pos: 'X', 
        xpos: designation.toLowerCase(),
        feats: {} // Очищаем признаки
      };
    } else {
      return { 
        pos: designation.toUpperCase(), 
        xpos: designation.toLowerCase(),
        feats: {} // Очищаем признаки
      };
    }
  };

  return {
    getDisplayPOS,
    preparePOSUpdate,
  };
};