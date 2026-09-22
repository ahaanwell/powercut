import Link from "next/link";
import PincodeSearchForm from "@/components/PincodeSearchForm";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-zinc-900">Page not found</h1>
      <p className="mt-2 text-zinc-600">
        That page doesn&apos;t exist. Try searching for a PIN code instead.
      </p>
      <div className="mt-6 flex justify-center">
        <PincodeSearchForm />
      </div>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-amber-700 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
