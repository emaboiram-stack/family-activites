import Link from "next/link";

export function SectionTabs({ active }: { active: "semana" | "calendario" }) {
  return (
    <div className="mb-5 flex gap-2 rounded-xl bg-neutral-100 p-1">
      <Link
        href="/semana"
        className={`flex-1 rounded-lg py-2 text-center text-sm font-medium ${
          active === "semana"
            ? "bg-white text-neutral-900 shadow-sm"
            : "text-neutral-500"
        }`}
      >
        Semana
      </Link>
      <Link
        href="/calendario"
        className={`flex-1 rounded-lg py-2 text-center text-sm font-medium ${
          active === "calendario"
            ? "bg-white text-neutral-900 shadow-sm"
            : "text-neutral-500"
        }`}
      >
        Calendario
      </Link>
    </div>
  );
}
