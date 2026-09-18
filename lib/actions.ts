"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { setActiveMemberIdCookie, clearActiveMemberIdCookie } from "./session";
import { DayOfWeek } from "./days";

// ---------- Miembros ----------

export async function createMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("El nombre no puede estar vacío");
  }

  const member = await prisma.member.create({
    data: { name },
  });

  await setActiveMemberIdCookie(member.id);
  revalidatePath("/");
  redirect("/semana");
}

export async function selectMember(formData: FormData) {
  const memberId = String(formData.get("memberId") ?? "");
  if (!memberId) {
    throw new Error("Selecciona un miembro");
  }
  await setActiveMemberIdCookie(memberId);
  redirect("/semana");
}

export async function switchMember() {
  await clearActiveMemberIdCookie();
  redirect("/");
}

// ---------- Actividades ----------

export async function createActivity(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const dayOfWeek = String(formData.get("dayOfWeek") ?? "") as DayOfWeek;
  const time = String(formData.get("time") ?? "").trim() || null;
  const memberId = String(formData.get("memberId") ?? "");
  const createdByMemberId = String(formData.get("createdByMemberId") ?? "");

  if (!title || !dayOfWeek || !memberId || !createdByMemberId) {
    throw new Error("Faltan datos para crear la actividad");
  }

  await prisma.activity.create({
    data: { title, dayOfWeek, time, memberId, createdByMemberId },
  });

  revalidatePath("/semana");
  redirect("/semana");
}

export async function updateActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const dayOfWeek = String(formData.get("dayOfWeek") ?? "") as DayOfWeek;
  const time = String(formData.get("time") ?? "").trim() || null;
  const memberId = String(formData.get("memberId") ?? "");

  if (!id || !title || !dayOfWeek || !memberId) {
    throw new Error("Faltan datos para editar la actividad");
  }

  await prisma.activity.update({
    where: { id },
    data: { title, dayOfWeek, time, memberId },
  });

  revalidatePath("/semana");
  redirect("/semana");
}

export async function toggleActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const current = await prisma.activity.findUnique({ where: { id } });
  if (!current) return;

  await prisma.activity.update({
    where: { id },
    data: { completed: !current.completed },
  });

  revalidatePath("/semana");
}

export async function deleteActivity(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.activity.delete({ where: { id } });
  revalidatePath("/semana");
  redirect("/semana");
}
