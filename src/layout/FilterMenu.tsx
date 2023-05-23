function Accordion({ title, children }: { title: string; children?: any; }) {
  return (
    <div className="accordion">
      <div className="accordion-title">
        <div className="accordion-title-name">{title}</div>
        <div className="accordion-title-arrow"></div>
      </div>
      <div className="accordion-content">
        {children}
      </div>
    </div>
  )
}

export default function FilterMenu() {
  return (
    <nav id="filter-menu">
      <h2>Filter</h2>
      <Accordion title="Breed"></Accordion>
    </nav>
  );
}