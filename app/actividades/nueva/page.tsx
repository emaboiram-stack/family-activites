import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveMemberId } from "@/lib/session";
import { createActivity } from "@/lib/actions";
import { DAYS, DAY_LABELS } from "@/lib/days";

export default async function NuevaActividadPage() {
  const activeMemberId = await getActiveMemberId();
  if (!activeMemberId) {
    redirect("/");
  }

  const members = await prisma.member.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/semana"
          className="text-2xl leading-none text-neutral-500"
          aria-label="Volver"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">
          Nueva actividad
        </h1>
      </div>

      <form action={createActivity} className="flex flex-col gap-5">
        <input type="hidden" name="createdByMemberId" value={activeMemberId} />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Título
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Ej: Sacar la basura"
            className="w-full rounded-xl border border-neutral-300 px-4 py-4 text-lg text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">Día</label>
          <select
            name="dayOfWeek"
            required
            defaultValue={DAYS[0]}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-4 text-lg text-neutral-900"
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {DAY_LABELS[day]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Hora (opcional)
          </label>
          <input
            type="time"
            name="time"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-4 text-lg text-neutral-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Asignada a
          </label>
          <select
            name="memberId"
            required
            defaultValue={activeMemberId}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-4 text-lg text-neutral-900"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white active:bg-neutral-700"
        >
          Crear actividad
        </button>
      </form>
    </main>
  );
}
