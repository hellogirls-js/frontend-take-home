import { useEffect, useState } from "react";

/**
 * 
 * @returns a select component
 */
export default function Select({ id, label, data, onChange, inline = true }: { id: string; label: string; data: SelectOption[]; onChange?: any; inline?: boolean; }) {
  const [value, setValue] = useState<string>("breed");
  const [descending, setDescending] = useState<boolean>(false);

  useEffect(() => {
    console.log(value);
    onChange({
      option: value,
      descending: descending
    });
  }, [value, descending]);

  return (
    <div className="select-container">
      <label htmlFor={id} className={`form-label ${inline ? "inline" : "default"}`}>{label}</label>
      <select className="dropdown" id={id}>
        {data.map((choice: SelectOption) => 
          <option value={choice.value} key={choice.value} onClick={() => { setValue(choice.value) }}>{choice.label}</option>
        )}
      </select>
    </div>
  );
}