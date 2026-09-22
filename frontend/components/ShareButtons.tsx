import { WhatsAppIcon, FacebookIcon, XIcon } from "./icons";

export default function ShareButtons({ url, text }: { url: string; text: string }) {
  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
      <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 [writing-mode:vertical-rl]">
        Notify neighbor
      </span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        <FacebookIcon className="h-5 w-5" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-zinc-800"
      >
        <XIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
