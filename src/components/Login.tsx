import { useContext, useState } from "react";
import TextInput from "./utility/TextInput";
import { AuthContext } from "../context/AuthProvider";
import Submit from "./utility/Submit";
import { useNavigate } from "react-router-dom";
import Error from "./utility/ErrorAlert";

export default function Login() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState<string>();

  return (
    <div id="login-container">
      <h2>Login</h2>
      <form id="login-form" onSubmit={(e) => {
        e.preventDefault();
        const userVal = (document.getElementById("user-name") as HTMLInputElement).value;
        const emailVal = (document.getElementById("user-email") as HTMLInputElement).value;
        if (!user) {
          setError("User could not be validated");
        } else if (userVal.length <= 0) {
          setError("Please provide a user name");
        } else if (emailVal.length <= 0 || !emailVal.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
          setError("Please provide a valid email");
        } else {
          user?.login({
            name: userVal,
            email: emailVal,
          }).then(() => {
            navigate("/")
          })
        }
      }}>
        <TextInput id="user-name" label="Name" />
        <TextInput id="user-email" label="Email" />
        <Submit id="login-submit" label="Login" />
      </form>
      {error && <Error message={error} />}
    </div>
  )
}