export default function Submit({ id, label, onClick }: { id: string; label: string; onClick?: any; }) {
  return (
    <input type="submit" id={id} onClick={onClick} className="button" aria-label={label} value={label} />
  );
}