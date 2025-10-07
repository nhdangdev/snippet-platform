export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/snippets - Get all snippets with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;
    const topic = searchParams.get('topic') || undefined;
    const authorId = searchParams.get('authorId') || undefined;
    const search = searchParams.get('search') || undefined;

    const snippets = await db.snippet.findAll({
      language,
      topic,
      authorId,
      search,
    });

    return NextResponse.json({ snippets });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippets' },
      { status: 500 }
    );
  }
}

// POST /api/snippets - Create new snippet
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 ~ [API] POST /api/snippets called');

    // Get session - NextAuth v5 doesn't need headers()
    const session = await auth();

    console.log('🚀 ~ [API] Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });

    if (!session?.user?.id) {
      console.log('🚀 ~ [API] Unauthorized - No session or user ID');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to create snippets.' },
        { status: 401 }
      );
    }

    console.log('🚀 ~ [API] User authenticated:', session.user.email);

    const body = await request.json();
    console.log('🚀 ~ [API] Request body:', {
      title: body.title,
      language: body.language,
      topicsCount: body.topics?.length,
      codeLength: body.code?.length,
      hasDescription: !!body.description,
      hasComplexity: !!body.complexity,
      isPublic: body.isPublic,
    });

    const { title, description, code, language, topics, complexity, isPublic } = body;

    // Validation
    if (!title || !code || !language) {
      console.log('🚀 ~ [API] Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: title, code, language' },
        { status: 400 }
      );
    }

    if (title.length < 3) {
      console.log('🚀 ~ [API] Validation failed: Title too short');
      return NextResponse.json(
        { error: 'Title must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (code.length < 10) {
      console.log('🚀 ~ [API] Validation failed: Code too short');
      return NextResponse.json(
        { error: 'Code must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Create snippet data
    const snippetData = {
      title: title.trim(),
      description: description?.trim() || '',
      code: code,
      language: language.toLowerCase(),
      topics: Array.isArray(topics) ? topics : [],
      complexity: complexity || undefined,
      authorId: session.user.id,
      isPublic: isPublic !== false, // Default true
    };

    console.log('🚀 ~ [API] Creating snippet with data:', {
      title: snippetData.title,
      language: snippetData.language,
      topicsCount: snippetData.topics.length,
      topics: snippetData.topics,
      complexity: snippetData.complexity,
      isPublic: snippetData.isPublic,
      authorId: snippetData.authorId,
    });

    const newSnippet = await db.snippet.create(snippetData);

    console.log('🚀 ~ [API] Snippet created successfully:', {
      id: newSnippet.id,
      title: newSnippet.title,
      language: newSnippet.language,
      topicsCount: newSnippet.topics.length,
    });

    return NextResponse.json(
      {
        message: 'Snippet created successfully',
        snippet: newSnippet
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error creating snippet:', error);
    console.error('[API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack',
      name: error instanceof Error ? error.name : 'Unknown',
    });

    return NextResponse.json(
      {
        error: 'Failed to create snippet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
