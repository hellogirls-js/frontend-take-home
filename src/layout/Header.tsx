import { IconPawFilled } from "@tabler/icons-react";

export default function Header() {
  return (
    <header>
      <div id="header-content">
        <div id="header-icon">
          <IconPawFilled size={40} style={{ transform: "rotate(-40deg)"}} />
        </div>
        <h1>Dog Finder</h1>
      </div>
    </header>
  );
}