import Link from "next/link";
import { resetWeek } from "@/lib/actions";
import { redirect } from "next/navigation";

async function resetWeekAndRedirect() {
  await resetWeek();
  redirect("/semana");
}

export default function ReiniciarSemanaPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-5 py-10">
      <div className="text-center">
        <h1 className="text-xl font-bold text-neutral-900">
          ¿Reiniciar la semana?
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Todas las actividades de todos los miembros volverán a quedar
          pendientes. Ninguna actividad se borra, solo se desmarca su estado
          de completada.
        </p>
      </div>

      <form action={resetWeekAndRedirect}>
        <button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white active:bg-neutral-700"
        >
          Sí, reiniciar todas
        </button>
      </form>

      <Link
        href="/semana"
        className="w-full rounded-xl border border-neutral-300 px-4 py-4 text-center text-lg font-medium text-neutral-700 active:bg-neutral-100"
      >
        Cancelar
      </Link>
    </main>
  );
}
