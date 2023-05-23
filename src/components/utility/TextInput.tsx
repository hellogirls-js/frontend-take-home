export default function TextInput({ id, label, inline = false }: { id: string; label: string; inline?: boolean; }) {
  return (
    <div className="textbox-container">
      <label htmlFor={id} className={`form-label ${inline ? "inline" : "default"}`}>{label}</label>
      <input type="text" id={id} className={`textbox ${inline ? "inline" : "default"}`} aria-label={label} />
    </div>
  );
}