import FilterBar from "@/components/FilterBar";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/dictionaries";
import { Eye } from "lucide-react";
import Link from "next/link";

export default async function BrowseSnippetsPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { language?: string; topic?: string; search?: string };
}) {
  const { lang } = params;
  const t = await getDictionary(lang);

  const snippets = await db.snippet.findAll({
    language: searchParams.language,
    topic: searchParams.topic,
    search: searchParams.search,
  });

  const tags = await db.tag.findAll();
  const languages = tags.filter((t) => t.type === "language");
  const topics = tags.filter((t) => t.type === "topic");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-black hover:text-blue-500">
              CodeSnippets
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              {t.home}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.browse_code_snippets}
          </h1>
          <p className="text-gray-600">
            {snippets.length} {t.snippets} {t.found}
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          languages={languages}
          topics={topics}
          currentLanguage={searchParams.language}
          currentTopic={searchParams.topic}
          currentSearch={searchParams.search}
        />

        {/* Results */}
        {snippets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No snippets found</p>
            <Link
              href="/snippets"
              className="text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
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
                  {snippet.description || "No description"}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {snippet.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{topic}
                    </span>
                  ))}
                  {snippet.topics.length > 3 && (
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      +{snippet.topics.length - 3}
                    </span>
                  )}
                </div>

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
        )}
      </div>
    </div>
  );
}
