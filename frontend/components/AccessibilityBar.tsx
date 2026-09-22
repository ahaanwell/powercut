import TextSizeControl from "./TextSizeControl";

export default function AccessibilityBar() {
  return (
    <div className="bg-blue-950 text-[11px] text-blue-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6">
        <a href="#main-content" className="hover:text-white hover:underline">
          Skip to Main Content
        </a>
        <div className="flex items-center gap-4">
          <TextSizeControl />
          <span className="hidden sm:inline">Screen Reader Access</span>
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-white">EN</span>
            <span className="text-blue-700">|</span>
            <span className="cursor-default opacity-70">हिं</span>
          </span>
        </div>
      </div>
    </div>
  );
}
