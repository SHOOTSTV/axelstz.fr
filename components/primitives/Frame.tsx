import Image from "next/image";

export function Frame({ src, alt = "", placeholder, fill = true, width, height, className, style, priority }:
  { src?: string; alt?: string; placeholder?: string; fill?: boolean; width?: number; height?: number; className?: string; style?: React.CSSProperties; priority?: boolean }) {
  const cls = `frame ${className ?? ""}`.trim();
  if (!src) {
    return <div className={`${cls} frame-empty`} style={style}><span className="frame-ph">{placeholder}</span></div>;
  }
  if (fill && !width) {
    return <div className={cls} style={{ position: "relative", ...style }}><Image src={src} alt={alt} fill sizes="100%" style={{ objectFit: "cover" }} priority={priority} /></div>;
  }
  return <div className={cls} style={style}><Image src={src} alt={alt} width={width ?? 100} height={height ?? 100} priority={priority} /></div>;
}
