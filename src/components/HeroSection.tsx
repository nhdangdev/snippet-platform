'use client';

import { Link } from "@/components/ui/Link";
import useTranslation from "@/hooks/useTranslation";
import { Session } from "next-auth";

interface HeroSectionProps {
  session: Session | null;
}

export default function HeroSection({ session }: HeroSectionProps) {
  // console.log("🚀 ~ HeroSection ~ session:", session)
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          {t('appName')}
        </h1>

        {!session && (
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-700 hover:text-white text-lg font-semibold"
          >
            {t("getStarted")}
          </Link>
        )}
      </div>
    </div>
  );
}
