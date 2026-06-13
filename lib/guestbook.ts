import { neon } from "@neondatabase/serverless";

export interface Note {
  id: string;
  name: string;
  message: string;
  link: string | null;
  createdAt: string;
}

interface Row {
  id: string;
  name: string;
  message: string;
  link: string | null;
  created_at: string;
}

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

const toNote = (r: Row): Note => ({
  id: r.id,
  name: r.name,
  message: r.message,
  link: r.link,
  createdAt: r.created_at,
});

export async function listApproved(limit = 100): Promise<Note[]> {
  const sql = db();
  const rows = (await sql`
    select id, name, message, link, created_at from guestbook
    where status = 'approved' order by created_at desc limit ${limit}
  `) as Row[];
  return rows.map(toNote);
}

export async function listPending(): Promise<Note[]> {
  const sql = db();
  const rows = (await sql`
    select id, name, message, link, created_at from guestbook
    where status = 'pending' order by created_at asc
  `) as Row[];
  return rows.map(toNote);
}

export async function insertPending(input: { name: string; message: string; link?: string }): Promise<void> {
  const sql = db();
  await sql`
    insert into guestbook (name, message, link)
    values (${input.name}, ${input.message}, ${input.link ?? null})
  `;
}

export async function approve(id: string): Promise<void> {
  const sql = db();
  await sql`update guestbook set status = 'approved' where id = ${id}`;
}

export async function remove(id: string): Promise<void> {
  const sql = db();
  await sql`delete from guestbook where id = ${id}`;
}
