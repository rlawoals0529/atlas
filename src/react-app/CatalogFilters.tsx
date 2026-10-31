import { useId, type ReactNode } from "react";
import { useModalDialog } from "./useModalDialog";

type Props = {
  children: ReactNode;
  mobile: boolean;
  onClose: () => void;
  onReset: () => void;
  count: number;
};

function MobileFilters({ children, onClose, onReset, count }: Props) {
  const titleId = useId();
  const dialogRef = useModalDialog<HTMLElement>(onClose);
  return <div className="catalog-filter-modal">
    <button type="button" className="catalog-filter-backdrop" tabIndex={-1} aria-hidden="true" onClick={onClose}/>
    <section ref={dialogRef} className="catalog-filter-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
      <header><h2 id={titleId}>Filter gear</h2><button type="button" data-dialog-initial-focus onClick={onClose} aria-label="Close filters">Close</button></header>
      <div className="catalog-filter-scroll">{children}</div>
      <footer><button type="button" onClick={onReset}>Reset filters</button><button type="button" className="catalog-filter-apply" onClick={onClose}>Show {count} {count === 1 ? "result" : "results"}</button></footer>
    </section>
  </div>;
}

export default function CatalogFilters(props: Props) {
  if (props.mobile) return <MobileFilters {...props}/>;
  return <aside className="catalog-filter-sidebar" aria-label="Catalog filters">
    <header><h3>Refine your search</h3><button type="button" onClick={props.onReset}>Reset</button></header>
    {props.children}
  </aside>;
}
