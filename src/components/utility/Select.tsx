
/**
 * 
 * @returns a select component
 */
export default function Select(
  { 
    id, 
    label, 
    data, 
    onChange, 
    inline = true, 
    placeholder, 
    icon,
    iconOnClick,
    defaultValue 
  }: 
  { 
    id: string; 
    label: string;
    data: SelectOption[]; 
    onChange?: any; 
    inline?: boolean; 
    placeholder?: string; 
    icon?: any; 
    iconOnClick?: any;
    defaultValue?: string;
  }) 
{

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    if (!defaultValue) {
      e.target.value = "";
    }
  }

  return (
    <div className="select-container">
      <label htmlFor={id} className={`form-label ${inline ? "inline" : "default"}`} aria-label={label}>{label}</label>
      <div className={`${"select-icon-container"}${icon ? " with-icon" : ""}`}>
        <select className="dropdown" id={id} value={defaultValue || ""} onChange={onChangeSelect} aria-label={label}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {data.map((choice: SelectOption) => 
            <option value={choice.value} key={choice.value}>{choice.label}</option>
          )}
        </select>
        {icon && (
          <div className="select-icon" onClick={() => { iconOnClick() }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}