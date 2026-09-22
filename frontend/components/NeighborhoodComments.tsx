import { getPincodeComments } from "@/lib/api";
import { timeAgo } from "@/lib/timeAgo";
import CommentForm from "./CommentForm";
import { MessageIcon } from "./icons";

export default async function NeighborhoodComments({ pincode }: { pincode: string }) {
  const { comments } = await getPincodeComments(pincode, 48).catch(() => ({ comments: [] }));

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500">
        <MessageIcon className="h-4 w-4 text-amber-600" />
        Neighborhood comments
      </h2>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
        Live neighborhood updates (last 48h)
      </p>

      {comments.length === 0 ? (
        <p className="mt-2 text-sm italic text-zinc-500">No live comments in the last 48 hours.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="rounded-lg bg-zinc-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-900">{c.name || "Anonymous"}</span>
                <span className="text-xs text-zinc-500">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-700">{c.message}</p>
            </li>
          ))}
        </ul>
      )}

      <CommentForm pincode={pincode} />
    </div>
  );
}
