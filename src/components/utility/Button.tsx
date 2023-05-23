export default function Button({ id, label, onClick }: { id: string; label: string; onClick?: any; }) {
  return (
    <button id={id} onClick={onClick} className="button" aria-label={label}>
      {label}
    </button>
  );
}