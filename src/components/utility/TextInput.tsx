export default function TextInput(
  { 
    id, 
    label, 
    inline = false, 
    placeholder, 
    onEnter 
  }: { 
    id: string; 
    label?: string; 
    inline?: boolean; 
    placeholder?: string; 
    onEnter?: any; 
  }) {
  return (
    <div className={`textbox-container ${inline ? "inline" : "default"}`}>
      {label && <label htmlFor={id} className={`form-label ${inline ? "inline" : "default"}`}>{label}</label>}
      <input type="text" id={id} className={`textbox ${inline ? "inline" : "default"}`} aria-label={label} placeholder={placeholder} onKeyUp={(e) => {
        if (onEnter && e.code === "Enter") {
          onEnter();
        }
      }} />
    </div>
  );
}