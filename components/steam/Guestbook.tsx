"use client";
import { useEffect, useState } from "react";
import { avatarFor } from "@/components/primitives/avatar";
import { isHttpUrl } from "@/lib/url";

interface Note {
  id: string;
  name: string;
  message: string;
  link: string | null;
  createdAt: string;
}

function Avatar({ name }: { name: string }) {
  const { bg, initial } = avatarFor(name);
  return (
    <span className="gb-av" style={{ background: bg }} aria-hidden>
      {initial}
    </span>
  );
}

export function Guestbook() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [hp, setHp] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d: Note[]) => { if (active) { setNotes(d); setLoaded(true); } })
      .catch(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  const sign = async () => {
    if (!name.trim() || !message.trim()) return;
    await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, link, hp }),
    });
    setName(""); setMessage(""); setLink(""); setSent(true);
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
  };

  return (
    <div className="comments" id="guestbook">
      <div className="comments-head">
        <span className="h">Guestbook</span>
      </div>

      {sent ? (
        <div className="gb-sent">Thanks — your note is awaiting approval.</div>
      ) : open ? (
        <div className="comment-box gb-form">
          <span className="cb-av"><Avatar name={name || "?"} /></span>
          <span className="cb-field">
            <input className="gb-name" aria-label="Your name" placeholder="Your name" value={name} maxLength={40} autoFocus onChange={(e) => setName(e.target.value)} />
            <textarea aria-label="Leave a note" placeholder="Leave a note" value={message} maxLength={280} onChange={(e) => setMessage(e.target.value)} />
            <input className="gb-link" aria-label="Link (optional, your portfolio or GitHub profile)" placeholder="Link (optional, your portfolio or GitHub profile)" value={link} maxLength={200} onChange={(e) => setLink(e.target.value)} />
            <input className="gb-hp" name="hp" tabIndex={-1} autoComplete="off" aria-hidden value={hp} onChange={(e) => setHp(e.target.value)} />
            <button className="post" onClick={sign}>Sign the guestbook</button>
          </span>
        </div>
      ) : (
        <div className="comment-box gb-collapsed">
          <span className="cb-av"><Avatar name="?" /></span>
          <button type="button" className="gb-add" onClick={() => setOpen(true)}>Add a comment</button>
          <button type="button" className="post" onClick={() => setOpen(true)}>Sign</button>
        </div>
      )}

      {loaded && notes.length === 0 && !sent && (
        <div className="gb-empty">Be the first to sign the guestbook.</div>
      )}

      {notes.map((c) => (
        <div className="comment" key={c.id}>
          <span className="c-av">
            {c.link && isHttpUrl(c.link) ? (
              <a href={c.link} target="_blank" rel="noreferrer nofollow"><Avatar name={c.name} /></a>
            ) : (
              <Avatar name={c.name} />
            )}
          </span>
          <span className="c-main">
            <span className="c-top">
              <span className="c-name">{c.name}</span>
              <span className="c-date">{fmtDate(c.createdAt)}</span>
            </span>
            <div className="c-text">{c.message}</div>
          </span>
        </div>
      ))}
    </div>
  );
}
