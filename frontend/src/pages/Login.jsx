import { useState } from 'react';
import api from "../services/api.js";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleForm(e) {
        e.preventDefault();
        try{
            //localStorage.clear();
            const resp = await api.post("/auth/login", {email, password});
            localStorage.setItem("token", resp.data.token);
            console.log(resp.data.token);
        }catch (error){
            console.log(error);
        }
    }

    return (

        <form onSubmit={handleForm}>
            <label>Email : </label>
            <input type={"email"} name={"email"}
                   onChange={
                       (e) => setEmail(e.target.value)
                   }
            />

            <label>Mot de passe</label>
            <input type={"password"}
                   onChange={
                       (e) => setPassword(e.target.value)
                   }
            />

            <input type="submit" value={"Se connecter"}/>
        </form>

    )
}

export default Login;