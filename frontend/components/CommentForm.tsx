"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { postComment } from "@/lib/api";
import { SendIcon } from "./icons";

const MAX_LEN = 280;

export default function CommentForm({ pincode }: { pincode: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length === 0) {
      setError("Write a short update before posting.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await postComment({ pincode, name: name.trim() || undefined, message: trimmed });
      setMessage("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        type="text"
        maxLength={60}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
      />
      <div className="relative">
        <textarea
          rows={3}
          maxLength={MAX_LEN}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share a live update for this pincode… (e.g. 'Power back at 3pm')"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
        <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-zinc-400">
          {message.length} / {MAX_LEN}
        </span>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 font-bold text-white hover:bg-amber-600 disabled:opacity-60"
      >
        <SendIcon className="h-4 w-4" />
        {busy ? "Posting…" : "Post Update"}
      </button>
    </form>
  );
}
