import SignOutButton from "@/components/SignOutButton";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/dictionaries";
import { Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const session = await auth();
  const t = await getDictionary(lang);

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`);
  }

  const mySnippets = await db.snippet.findAll({ authorId: session.user.id });
  const stats = await db.stats.getUserStats(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:h-16 items-center">
            <Link href="/" className="text-xl font-bold text-black hover:text-blue-500">
              CodeSnippets
            </Link>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 py-2 md:py-2 space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                {t.home}
              </Link>
              <Link
                href="/snippets/new"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700"
              >
                + New Snippet
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.welcomeBack}, {session.user.name}!
          </h1>
          <p className="text-gray-600">{session.user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Snippets</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalSnippets}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Views</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.totalViews}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Languages Used</div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.languages.length}
            </div>
          </div>
        </div>

        {/* My Snippets */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">My Snippets</h2>
            <Link
              href="/snippets/new"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Create New
            </Link>
          </div>

          {mySnippets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">You haven't created any snippets yet</p>
              <Link
                href="/snippets/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Snippet
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {mySnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/snippets/${snippet.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 block mb-2"
                      >
                        {snippet.title}
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {snippet.description || "No description"}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {snippet.language}
                        </span>
                        {snippet.complexity && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {snippet.complexity}
                          </span>
                        )}
                        <span>👁️ {snippet.views} views</span>
                        <span>
                          {new Date(snippet.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <Link
                        href={`/snippets/${snippet.id}/edit`}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/snippets/${snippet.id}`}
                        className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-700"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/snippets"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className=" mb-2"><Search /></div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse Snippets</h3>
            <p className="text-sm text-gray-600">
              Discover snippets from other developers
            </p>
          </Link>

          <Link
            href="/profile"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className=" mb-2"><User /></div>
            <h3 className="font-semibold text-gray-900 mb-2">My Profile</h3>
            <p className="text-sm text-gray-600">
              View your public profile page
            </p>
          </Link>

          <Link
            href="/snippets/new"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className=" mb-2"><Plus /></div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Snippet</h3>
            <p className="text-sm text-gray-600">
              Share your code with the community
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
