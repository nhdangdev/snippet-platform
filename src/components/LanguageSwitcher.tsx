'use client';

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawLang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const currentLang = (rawLang === 'vi' || rawLang === 'en') ? rawLang : 'en';
  const [lang, setLang] = useState<'en' | 'vi'>(currentLang);

  useEffect(() => {
    setLang(currentLang);
  }, [currentLang]);

  const handleChangeLang = (newLang: 'en' | 'vi') => {
    if (newLang === lang) return;

    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'en' || segments[0] === 'vi') {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }

    router.push('/' + segments.join('/'));
  };

  return (
    <div className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none">
      <p
        className={cn(lang === 'vi' ? 'text-black' : 'text-gray-400')}
        onClick={() => handleChangeLang('vi')}
      >
        VI
      </p>
      <span>/</span>
      <p
        className={cn(lang === 'en' ? 'text-black' : 'text-gray-400')}
        onClick={() => handleChangeLang('en')}
      >
        EN
      </p>
    </div>
  );
}
