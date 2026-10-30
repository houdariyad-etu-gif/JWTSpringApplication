import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function Profile() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get("/api/profile");
                setMessage(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement du profil :", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        loadProfile();
    }, [navigate]);

    function logout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div>
            <h3>Bienvenue dans la page de profil</h3>

            <p>{message}</p>

            <button onClick={logout}>
                Se déconnecter
            </button>
        </div>
    );
}

export default Profile;
