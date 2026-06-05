"use client";
import { useState } from "react";
import type { PortfolioData, Testimonial } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";
import { Frame } from "@/components/primitives/Frame";

export function Testimonials({ data }: { data: PortfolioData }) {
  const [list, setList] = useState<Testimonial[]>(data.testimonials);
  const [text, setText] = useState("");

  const post = () => {
    const t = text.trim();
    if (!t) return;
    setList([{ name: data.profile.name, date: "Just now", text: t, image: "/images/avatar.png" }, ...list]);
    setText("");
  };

  return (
    <div className="comments" id="community">
      <div className="comments-head">
        <span className="h">Testimonials</span>
        <span className="subscribe">
          <span className="box"><Icon name="check" size={11} /></span> Subscribe to thread
        </span>
      </div>
      <div className="comments-sub">
        <span className="cnt">Showing {list.length} testimonials</span>
      </div>

      <div className="comment-box">
        <span className="cb-av"><Frame src="/images/avatar.png" alt="" placeholder="" /></span>
        <span className="cb-field">
          <textarea
            placeholder="Add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) post(); }}
          />
          <button className="post" onClick={post}>Post</button>
        </span>
      </div>

      {list.map((c, i) => (
        <div className="comment" key={i}>
          <span className="c-av"><Frame src={c.image} alt={c.name} placeholder="" /></span>
          <span className="c-main">
            <span className="c-top">
              <span className={`c-name ${c.special ? "special" : ""}`}>{c.name}</span>
              <span className="c-date">{c.date}</span>
            </span>
            <div className="c-text">{c.text}</div>
          </span>
        </div>
      ))}
    </div>
  );
}
