"use client";

import * as React from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  title?: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const targetUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    if (!targetUrl) return;

    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      toast.success(
        title
          ? `Tautan "${title}" berhasil disalin!`
          : "Tautan artikel berhasil disalin ke clipboard!"
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Gagal menyalin tautan.");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary font-medium">Tersalin!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Salin Tautan</span>
        </>
      )}
    </Button>
  );
}
