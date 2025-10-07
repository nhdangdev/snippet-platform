"use client";
import { Button } from "@/components/ui/Button";

export function CopyCodeButton({ code }: { code: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  return (
    <Button
      onClick={handleCopy}
      variant='copy'
    >
      Copy
    </Button>
  );
}

export function CopyLinkButton() {
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <Button
      className="w-full"
      onClick={handleCopyLink}
      variant='copy'
    >
      Copy Link
    </Button>
  );
}
