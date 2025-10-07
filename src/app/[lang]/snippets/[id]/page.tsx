import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import CodeBlock from "@/components/CodeBlock";
import DeleteButton from "@/components/DeleteButton";
import { CopyCodeButton, CopyLinkButton } from "@/components/CopyButtons";
import { Eye } from "lucide-react";


export default async function SnippetDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  const snippet = await db.snippet.findById(params.id);
  // console.log("🚀 ~ SnippetDetailPage ~ snippet:", snippet);

  if (!snippet) notFound();

  const isOwner = session?.user?.id === snippet.authorId;
  const authorStats = await db.stats.getUserStats(snippet.authorId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-black hover:text-blue-500">
              CodeSnippets
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
              {isOwner && (
                <Link
                  href={`/snippets/${snippet.id}/edit`}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {snippet.title}
                  </h1>
                  <p className="text-gray-600">{snippet.description}</p>
                </div>
                {snippet.complexity && (
                  <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shrink-0">
                    {snippet.complexity}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex gap-2 items-center">
                  <Eye className="size-5" /> {snippet.views} views
                </span>
                <span> - </span>
                <span>
                  {new Date(snippet.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Code Block */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
                <span className="text-white font-mono text-sm">
                  {snippet.language}
                </span>
                <CopyCodeButton code={snippet.code} />
              </div>
              <CodeBlock code={snippet.code} language={snippet.language} />
            </div>


            {/* Topics */}
            {snippet.topics.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {snippet.topics.map((topic) => (
                    <Link
                      key={topic}
                      href={`/snippets?topic=${topic}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      #{topic}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Button (Owner only) */}
            {isOwner && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Once you delete a snippet, there is no going back.
                </p>
                <DeleteButton snippetId={snippet.id} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Author</h3>
              <div className="flex items-center space-x-3 mb-4">
                {snippet.author?.avatar && (
                  <img
                    src={snippet.author.avatar}
                    alt={snippet.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {snippet.author?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {snippet.author?.email}
                  </div>
                </div>
              </div>
              {snippet.author?.bio && (
                <p className="text-sm text-gray-600 mb-4">
                  {snippet.author.bio}
                </p>
              )}
              <Link
                // href={`/profile/${snippet.authorId}`}
                href={`/profile`}
                className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                View Profile
              </Link>
            </div>

            {/* Author Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Snippets</span>
                  <span className="font-semibold">{authorStats.totalSnippets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-semibold">{authorStats.totalViews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-semibold">{authorStats.languages.length}</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Share</h3>
              <CopyLinkButton />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
