export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/snippets/[id] - Get single snippet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const snippet = await db.snippet.findById(id);

    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    return NextResponse.json({ snippet });
  } catch (error) {
    console.error('Error fetching snippet:', error);
    return NextResponse.json({ error: 'Failed to fetch snippet' }, { status: 500 });
  }
}

// PUT /api/snippets/[id] - Update snippet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snippet = await db.snippet.findById(id);

    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    // Check ownership
    if (snippet.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own snippets' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, code, language, topics, complexity, isPublic } = body;

    // Validation
    if (title && title.length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    }

    if (code && code.length < 10) {
      return NextResponse.json({ error: 'Code must be at least 10 characters' }, { status: 400 });
    }

    // Update snippet
    const updatedSnippet = await db.snippet.update(id, {
      title,
      description,
      code,
      language: language?.toLowerCase(),
      topics,
      complexity,
      isPublic,
      authorId: session.user.id,
    });

    console.log('🚀 ~ Snippet updated:', id);

    return NextResponse.json({
      message: 'Snippet updated successfully',
      snippet: updatedSnippet,
    });
  } catch (error) {
    console.error('Error updating snippet:', error);
    return NextResponse.json({ error: 'Failed to update snippet' }, { status: 500 });
  }
}

// DELETE /api/snippets/[id] - Delete snippet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snippet = await db.snippet.findById(id);

    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    // Check ownership
    if (snippet.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own snippets' }, { status: 403 });
    }

    // Delete snippet
    await db.snippet.delete(id);

    console.log('🚀 ~ Snippet deleted:', id);

    return NextResponse.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}
