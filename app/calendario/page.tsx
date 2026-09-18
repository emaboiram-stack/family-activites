import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveMemberId } from "@/lib/session";
import { toggleEventConfirmed, switchMember } from "@/lib/actions";
import { SectionTabs } from "@/components/SectionTabs";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatFecha(d: Date) {
  const dia = d.getDate();
  const mes = MESES[d.getMonth()];
  return `${dia} de ${mes}`;
}

export default async function CalendarioPage() {
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

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const en3Meses = new Date(hoy);
  en3Meses.setMonth(en3Meses.getMonth() + 3);

  const events = await prisma.event.findMany({
    where: { date: { gte: hoy, lte: en3Meses } },
    include: { member: true },
    orderBy: { date: "asc" },
  });

  // Agrupar por "Mes AAAA" en el orden en que aparecen (ya vienen ordenados por fecha)
  const grupos: { etiqueta: string; events: typeof events }[] = [];
  for (const event of events) {
    const etiqueta = `${MESES[event.date.getMonth()]} ${event.date.getFullYear()}`;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.etiqueta === etiqueta) {
      ultimo.events.push(event);
    } else {
      grupos.push({ etiqueta, events: [event] });
    }
  }

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

      <SectionTabs active="calendario" />

      <p className="mb-4 text-sm text-neutral-500">
        Próximos 3 meses, previsión compartida de toda la familia.
      </p>

      {grupos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-200 px-3 py-6 text-center text-sm text-neutral-400">
          No hay eventos previstos
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {grupos.map((grupo) => (
            <section key={grupo.etiqueta}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
                {grupo.etiqueta}
              </h2>
              <ul className="flex flex-col gap-2">
                {grupo.events.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3"
                  >
                    <form action={toggleEventConfirmed}>
                      <input type="hidden" name="id" value={event.id} />
                      <button
                        type="submit"
                        aria-label={
                          event.confirmed
                            ? "Marcar como pendiente"
                            : "Marcar como confirmado"
                        }
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                          event.confirmed
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-neutral-300 text-transparent"
                        }`}
                      >
                        ✓
                      </button>
                    </form>

                    <Link
                      href={`/calendario/${event.id}/editar`}
                      className="min-w-0 flex-1"
                    >
                      <p
                        className={`truncate text-base font-medium ${
                          event.confirmed
                            ? "text-neutral-400 line-through"
                            : "text-neutral-900"
                        }`}
                      >
                        <span className="mr-2 text-sm font-semibold text-neutral-500">
                          {formatFecha(event.date)}
                        </span>
                        {event.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {event.member.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Link
        href="/calendario/nuevo"
        className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-neutral-900 px-4 py-4 text-center text-lg font-semibold text-white shadow-lg active:bg-neutral-700"
      >
        + Nuevo evento
      </Link>
    </main>
  );
}
