import { prisma } from "@/lib/prisma";
import { createMember, selectMember } from "@/lib/actions";
import { getActiveMemberId } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const activeMemberId = await getActiveMemberId();
  if (activeMemberId) {
    const exists = await prisma.member.findUnique({
      where: { id: activeMemberId },
    });
    if (exists) {
      redirect("/semana");
    }
  }

  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-5 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          Actividades de la familia
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Elige quién eres para continuar
        </p>
      </div>

      {members.length > 0 && (
        <form action={selectMember} className="flex flex-col gap-3">
          <label className="text-sm font-medium text-neutral-700">
            Soy...
          </label>
          <div className="flex flex-col gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                type="submit"
                name="memberId"
                value={m.id}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-4 text-left text-lg font-medium text-neutral-900 active:bg-neutral-100"
              >
                {m.name}
              </button>
            ))}
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6">
        <label className="text-sm font-medium text-neutral-700">
          {members.length > 0
            ? "¿Eres nuevo en la familia?"
            : "Aún no hay miembros. Crea el primero:"}
        </label>
        <form action={createMember} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            required
            className="w-full rounded-xl border border-neutral-300 px-4 py-4 text-lg text-neutral-900 placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white active:bg-neutral-700"
          >
            Crear miembro
          </button>
        </form>
      </div>
    </main>
  );
}
