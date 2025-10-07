import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import EditSnippetForm from "@/components/EditSnippetForm";

export default async function EditSnippetPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const snippet = await db.snippet.findById(params.id);

  if (!snippet) {
    notFound();
  }

  // Check ownership
  if (snippet.authorId !== session.user.id) {
    redirect(`/snippets/${params.id}`);
  }

  return <EditSnippetForm snippet={snippet} />;
}
