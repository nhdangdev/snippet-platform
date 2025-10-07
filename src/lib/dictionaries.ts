import 'server-only';
import en from '../../locale/en.json';
import vi from '../../locale/vi.json';

const dictionaries = {
  en,
  vi,
};

export const getDictionary = async (lang: string) => {
  return dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
};
