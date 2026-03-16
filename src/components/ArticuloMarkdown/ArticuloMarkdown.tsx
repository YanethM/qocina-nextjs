"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./ArticuloMarkdown.module.css";

const NUMBER_IMAGES: Record<number, string> = {
  1: "/images/web/noticias/noticia_detail/uno.svg",
  2: "/images/web/noticias/noticia_detail/dos.svg",
  3: "/images/web/noticias/noticia_detail/tres.svg",
  4: "/images/web/noticias/noticia_detail/cuatro.svg",
  5: "/images/web/noticias/noticia_detail/cinco.svg",
  6: "/images/web/noticias/noticia_detail/seis.svg",
  7: "/images/web/noticias/noticia_detail/siete.svg",
};

type NumberedItem = { num: number; label: string; body: string };
type Section =
  | { type: "numbered-group"; items: NumberedItem[] }
  | { type: "normal"; body: string }
  | { type: "card"; body: string };

function parseContent(content: string): Section[] {
  const lines = content.split("\n");
  const sections: Section[] = [];
  let currentType: "numbered" | "normal" | null = null;
  let currentNum = 0;
  let currentLabel = "";
  let currentLines: string[] = [];

  const flush = () => {
    if (currentType === null) return;
    const body = currentLines.join("\n").trim();
    if (currentType === "numbered") {
      const last = sections[sections.length - 1];
      const item: NumberedItem = { num: currentNum, label: currentLabel, body };
      if (last?.type === "numbered-group") {
        last.items.push(item);
      } else {
        sections.push({ type: "numbered-group", items: [item] });
      }
    } else if (body) {
      sections.push({ type: "normal", body });
    }
    currentLines = [];
    currentType = null;
  };

  for (const line of lines) {
    const match = line.match(/^###\s+(\d+)\.\s+(.+)/);
    if (match) {
      flush();
      currentType = "numbered";
      currentNum = parseInt(match[1]);
      currentLabel = match[2];
    } else {
      if (currentType === null) currentType = "normal";
      currentLines.push(line);
    }
  }
  flush();

  const hasNumbered = sections.some((s) => s.type === "numbered-group");

  if (!hasNumbered && sections.length === 1 && sections[0].type === "normal") {
    const body = (sections[0] as { type: "normal"; body: string }).body;
    const firstParaEnd = body.indexOf("\n\n");
    const secondParaEnd = firstParaEnd !== -1 ? body.indexOf("\n\n", firstParaEnd + 2) : -1;
    const splitAt = secondParaEnd !== -1 ? secondParaEnd : firstParaEnd;
    if (splitAt !== -1) {
      const firstPara = body.slice(0, splitAt).trim();
      const rest = body.slice(splitAt).trim();
      if (firstPara && rest) {
        return [
          { type: "normal", body: firstPara },
          { type: "card", body: rest },
        ];
      }
    }
  }

  return sections;
}

const mdComponents = {
  ol({ children }: { children?: React.ReactNode }) {
    const items = React.Children.toArray(children).filter(
      (child) => React.isValidElement(child)
    );
    return (
      <div className={styles.ol}>
        {items.map((child, idx) => {
          const num = idx + 1;
          const imgSrc = NUMBER_IMAGES[num];
          const liChild = child as React.ReactElement<{
            children: React.ReactNode;
          }>;
          return (
            <div key={idx} className={styles.li}>
              {imgSrc ? (
                <img src={imgSrc} alt={String(num)} className={styles.numImg} />
              ) : (
                <span className={styles.numFallback}>{num}.</span>
              )}
              <span className={styles.liContent}>{liChild.props.children}</span>
            </div>
          );
        })}
      </div>
    );
  },
  ul({ children }: { children?: React.ReactNode }) {
    return <ul className={styles.ul}>{children}</ul>;
  },
  h2({ children }: { children?: React.ReactNode }) {
    return <h2 className={styles.h2}>{children}</h2>;
  },
  h3({ children }: { children?: React.ReactNode }) {
    return <h3 className={styles.h3}>{children}</h3>;
  },
  blockquote({ children }: { children?: React.ReactNode }) {
    return <div className={styles.blockquote}>{children}</div>;
  },
  p({ children }: { children?: React.ReactNode }) {
    return <p className={styles.p}>{children}</p>;
  },
  li({ children }: { children?: React.ReactNode }) {
    return <li className={styles.ulLi}>{children}</li>;
  },
  strong({ children }: { children?: React.ReactNode }) {
    return <strong className={styles.strong}>{children}</strong>;
  },
};

export default function ArticuloMarkdown({ content }: { content: string }) {
  const sections = parseContent(content);

  return (
    <div className={styles.root}>
      {sections.map((section, i) => {
        if (section.type === "numbered-group") {
          return (
            <div key={i} className={styles.numberedCard}>
              {section.items.map((item) => {
                const imgSrc = NUMBER_IMAGES[item.num];
                return (
                  <React.Fragment key={item.num}>
                    <div className={styles.numberedItem}>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={String(item.num)}
                          className={styles.numImg}
                        />
                      ) : (
                        <span className={styles.numFallback}>{item.num}.</span>
                      )}
                      <div className={styles.numberedTextBlock}>
                        <span className={styles.numberedLabel}>{item.label}</span>
                        {item.body && (
                          <ReactMarkdown components={mdComponents}>
                            {item.body}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          );
        }
        if (section.type === "card") {
          return (
            <div key={i} className={styles.numberedCard}>
              <ReactMarkdown components={mdComponents}>
                {section.body}
              </ReactMarkdown>
            </div>
          );
        }
        return (
          <div key={i} className={styles.normalSection}>
            <ReactMarkdown components={mdComponents}>
              {section.body}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
