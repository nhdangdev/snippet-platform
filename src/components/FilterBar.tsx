"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { Tag } from "@/lib/db/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  languages: Tag[];
  topics: Tag[];
  currentLanguage?: string;
  currentTopic?: string;
  currentSearch?: string;
}

export default function FilterBar({
  languages,
  topics,
  currentLanguage,
  currentTopic,
  currentSearch,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch || "");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/snippets?${params.toString()}`);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    updateFilter("search", search || null);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/snippets");
  };

  const hasFilters = currentLanguage || currentTopic || currentSearch;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snippets..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            type="submit"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Languages */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Language</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("language", null)}
            className={cn('px-3 py-1 rounded-full text-sm border transition',
              !currentLanguage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
            )}
          >
            All
          </button>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => updateFilter("language", lang.slug)}
              className={cn('px-3 py-1 rounded-full text-sm border transition',
                currentLanguage === lang.slug
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
              )}
            >
              {lang.name} ({lang.count})
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Topic</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("topic", null)}
            className={cn('px-3 py-1 rounded-full text-sm border transition',
                !currentTopic
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
            )}
          >
            All
          </button>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => updateFilter("topic", topic.slug)}
                className={cn('px-3 py-1 rounded-full text-sm border transition',
                currentTopic === topic.slug
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
            )}
            >
              {topic.name} ({topic.count})
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="pt-4 border-t">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
