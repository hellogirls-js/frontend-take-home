import { useContext } from "react";
import TextInput from "./utility/TextInput";
import { AuthContext } from "../context/AuthProvider";
import Submit from "./utility/Submit";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div id="login-container">
      <h2>Login</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const userVal = (document.getElementById("user-name") as HTMLInputElement).value;
        const emailVal = (document.getElementById("user-email") as HTMLInputElement).value;
        if (!user) {
          throw new Error("A user object could not be found");
        } else if (!emailVal.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
          throw new Error ("Email is invalid");
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
    </div>
  )
}