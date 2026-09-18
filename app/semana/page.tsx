import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveMemberId } from "@/lib/session";
import { toggleActivity, switchMember } from "@/lib/actions";
import { DAYS, DAY_LABELS } from "@/lib/days";
import { SectionTabs } from "@/components/SectionTabs";

export default async function SemanaPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const activeMemberId = await getActiveMemberId();
  if (!activeMemberId) {
    redirect("/");
  }

  const activeMember = await prisma.member.findUnique({
    where: { id: activeMemberId },
  });
  if (!activeMember) {
    redirect("/");
  }

  const { filtro } = await searchParams;
  const soloMias = filtro === "mias";

  const activities = await prisma.activity.findMany({
    where: soloMias ? { memberId: activeMemberId } : undefined,
    include: { member: true },
    orderBy: { createdAt: "asc" },
  });

  const byDay = Object.fromEntries(
    DAYS.map((day) => {
      const dayActivities = activities.filter((a) => a.dayOfWeek === day);
      // Con hora primero (orden ascendente), sin hora al final, manteniendo
      // el orden de creación dentro de cada grupo.
      const conHora = dayActivities
        .filter((a) => a.time)
        .sort((a, b) => a.time!.localeCompare(b.time!));
      const sinHora = dayActivities.filter((a) => !a.time);
      return [day, [...conHora, ...sinHora]];
    })
  );

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-28 pt-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-500">Sesión activa</p>
          <p className="text-lg font-semibold text-neutral-900">
            {activeMember.name}
          </p>
        </div>
        <form action={switchMember}>
          <button
            type="submit"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 active:bg-neutral-100"
          >
            Cambiar
          </button>
        </form>
      </header>

      <SectionTabs active="semana" />

      <div className="mb-5 flex gap-2 rounded-xl bg-neutral-100 p-1">
        <Link
          href="/semana?filtro=todas"
          className={`flex-1 rounded-lg py-2 text-center text-sm font-medium ${
            !soloMias
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Todas
        </Link>
        <Link
          href="/semana?filtro=mias"
          className={`flex-1 rounded-lg py-2 text-center text-sm font-medium ${
            soloMias
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Solo las mías
        </Link>
      </div>

      <Link
        href="/semana/reiniciar"
        className="mb-5 block rounded-xl border border-dashed border-neutral-300 px-3 py-2 text-center text-sm font-medium text-neutral-500 active:bg-neutral-100"
      >
        Reiniciar semana (desmarcar todas)
      </Link>

      <div className="flex flex-col gap-6">
        {DAYS.map((day) => (
          <section key={day}>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
              {DAY_LABELS[day]}
            </h2>

            {byDay[day].length === 0 ? (
              <p className="rounded-lg border border-dashed border-neutral-200 px-3 py-3 text-sm text-neutral-400">
                Sin actividades
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {byDay[day].map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3"
                  >
                    <form action={toggleActivity}>
                      <input type="hidden" name="id" value={activity.id} />
                      <button
                        type="submit"
                        aria-label={
                          activity.completed
                            ? "Marcar como pendiente"
                            : "Marcar como completada"
                        }
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                          activity.completed
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-neutral-300 text-transparent"
                        }`}
                      >
                        ✓
                      </button>
                    </form>

                    <Link
                      href={`/actividades/${activity.id}/editar`}
                      className="min-w-0 flex-1"
                    >
                      <p
                        className={`truncate text-base font-medium ${
                          activity.completed
                            ? "text-neutral-400 line-through"
                            : "text-neutral-900"
                        }`}
                      >
                        {activity.time && (
                          <span className="mr-2 text-sm font-semibold text-neutral-500">
                            {activity.time}
                          </span>
                        )}
                        {activity.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {activity.member.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <Link
        href="/actividades/nueva"
        className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-neutral-900 px-4 py-4 text-center text-lg font-semibold text-white shadow-lg active:bg-neutral-700"
      >
        + Nueva actividad
      </Link>
    </main>
  );
}
