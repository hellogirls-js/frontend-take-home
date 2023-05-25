import { IconExclamationCircle } from "@tabler/icons-react";

export default function ErrorAlert({message}: {message: string}) {
  return (
    <div className="error">
      <div className="error-icon">
        <IconExclamationCircle />
       </div>
       <div className="error-text">
        {message}
       </div>
    </div>
  );
}