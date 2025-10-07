'use client';

import { useParams } from 'next/navigation';
import en from '../../locale/en.json';
import vi from '../../locale/vi.json';

type Translation = Record<string, string>;

interface Params {
  [key: string]: string | undefined;
  lang?: 'en' | 'vi';
}

function useTranslation() {
  const params = useParams<Params>();

  const langParam = Array.isArray(params?.lang)
    ? params.lang[0]
    : params?.lang;

  const lang: 'en' | 'vi' = langParam === 'vi' ? 'vi' : 'en';

  const t = (key: string): string => {
    const translations: Translation = lang === 'en' ? en : vi;
    return translations[key] || key;
  };

  return { t, lang };
}

export default useTranslation;
