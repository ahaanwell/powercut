"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { submitContactMessage } from "@/lib/api";
import type { ContactCategory } from "@/lib/types";
import { AlertCircleIcon, MessageIcon, SendIcon, ShieldIcon } from "./icons";

const MAX_LEN = 2000;

const CATEGORIES: { value: ContactCategory; label: string; icon: typeof AlertCircleIcon }[] = [
  { value: "bug", label: "Bug", icon: AlertCircleIcon },
  { value: "feedback", label: "Feedback", icon: MessageIcon },
  { value: "general", label: "General", icon: ShieldIcon },
];

const PLACEHOLDERS: Record<ContactCategory, string> = {
  bug: "What went wrong? What did you expect? Steps to reproduce?",
  feedback: "What would make PowerCut more useful for you?",
  general: "What's on your mind?",
};

export default function ContactForm() {
  const router = useRouter();
  const [category, setCategory] = useState<ContactCategory>("bug");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length === 0) {
      setError("Please write a message before sending.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await submitContactMessage({
        category,
        message: trimmed,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg bg-emerald-50 p-5 text-center ring-1 ring-emerald-600/20">
        <p className="font-bold text-emerald-900">Thanks — your message was sent!</p>
        <p className="mt-1 text-sm text-emerald-700">
          {email.trim()
            ? "We'll get back to you at the email you provided if a reply is needed."
            : "Since no email was provided, we won't be able to reply directly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        {CATEGORIES.map((c) => {
          const active = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                active
                  ? "border-blue-950 bg-blue-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-blue-300"
              }`}
            >
              <c.icon className="h-3.5 w-3.5" />
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="block text-sm font-bold text-blue-950">
          What&apos;s on your mind?
        </label>
        <div className="relative mt-1.5">
          <textarea
            id="contact-message"
            rows={5}
            maxLength={MAX_LEN}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={PLACEHOLDERS[category]}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-zinc-400">
            {message.length}/{MAX_LEN}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-bold text-blue-950">
            Name <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            id="contact-name"
            type="text"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-bold text-blue-950">
            Email <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <p className="mt-1 text-xs text-zinc-500">Add email if you expect a reply :)</p>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-60"
        >
          <SendIcon className="h-4 w-4" />
          {busy ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
