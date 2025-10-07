
import HeroSection from "@/components/HeroSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link } from "@/components/ui/Link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/dictionaries";
import { Eye } from "lucide-react";

export default async function Home({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const t = await getDictionary(lang);
  const session = await auth();
  const snippets = await db.snippet.findAll({});
  const tags = await db.tag.findAll();
  const languages = tags.filter(t => t.type === 'language');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between py-2 md:py-2 md:h-16 items-center">
            <div className="flex flex-col md:flex-row items-start md:items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-black hover:text-blue-500">
                CodeSnippets
              </Link>
              <Link href="/snippets" className="text-gray-600 hover:text-gray-900">
                {t.snippets}
              </Link>
              {session && (
                <Link href="/snippets/new" className="text-gray-600 hover:text-gray-900">
                  {t.create}
                </Link>
              )}
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-center space-x-4">
              <LanguageSwitcher />
              {session?.user ? (
                <>
                  <Link href="/profile">
                    {t.profile}
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-black text-white rounded-md hover:text-white hover:bg-gray-700"
                  >
                    {t.dashboard}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`${lang}/auth/signin`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {t.signIn}
                  </Link>
                  <Link
                    href={`${lang}/auth/signup`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {t.signUp}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <HeroSection session={session} />

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{snippets.length}</div>
            <div className="text-gray-600 mt-2">{t.codeSnippets}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{languages.length}</div>
            <div className="text-gray-600 mt-2">{t.language}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {snippets.reduce((sum, s) => sum + s.views, 0)}
            </div>
            <div className="text-gray-600 mt-2">{t.totalViews}</div>
          </div>
        </div>
      </div>

      {/* Popular Languages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.popularLanguages}</h2>
        <div className="flex flex-wrap gap-3">
          {languages.slice(0, 6).map((lang) => (
            <Link
              key={lang.id}
              href={`/snippets?language=${lang.slug}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-blue-500 hover:text-blue-600 transition"
            >
              {lang.name} ({lang.count})
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Snippets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t.latestSnippets}</h2>
          <Link href="/snippets" className="text-blue-600 hover:text-blue-700">
            {t.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.slice(0, 6).map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 block"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {snippet.title}
                </h3>
                {snippet.complexity && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded shrink-0">
                    {snippet.complexity}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {snippet.description || 'No description'}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {snippet.language}
                </span>
                <div className="flex items-center space-x-4 text-gray-500">
                  <span><Eye /> {snippet.views}</span>
                  <span>by {snippet.author?.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 Demo Application. Built as part of a technical interview submission.</p>
        </div>
      </footer>
    </div>
  );
}
