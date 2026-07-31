import type { IndexEntry } from "@/content/site";

export function IndexList({ items, labelledBy }: { items: IndexEntry[]; labelledBy: string }) {
  return (
    <div className="index-list" role="list" aria-labelledby={labelledBy}>
      {items.map((item, index) => {
        const content = (
          <>
            <span className="index-row__count" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="index-row__name">{item.name}</span>
            <span className="index-row__description">{item.description}</span>
            {item.meta ? (
              <span className={`index-row__meta${item.placeholder ? " is-placeholder" : ""}`}>{item.meta}</span>
            ) : (
              <span className="index-row__meta" aria-hidden="true" />
            )}
            {item.href && <span className="index-row__arrow" aria-hidden="true">↗</span>}
          </>
        );

        return item.href ? (
          <a className="index-row" role="listitem" href={item.href} key={item.name}>{content}</a>
        ) : (
          <div className="index-row" role="listitem" key={item.name}>{content}</div>
        );
      })}
    </div>
  );
}
