import { Modal, Button } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {signIn, signOut} from 'next-auth/react';
import { useSession } from "next-auth/react";

const LoginModal = ({ show, handleClose }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const { data: session, status } = useSession()



    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        console.log("HANDLE LOGIN")
        console.log(credentials)

        const result = await signIn('credentials', {
            ...credentials,
            redirect: false
        });

        if (result.error) {
            console.log("login result error");
            setError('Nom d\'utilisateur ou mot de passe incorrect.');

        } else {
            console.log("login ok : " + result.ok);
            console.log("mais user is ... / ")
            console.log(session?.user)

            // Rediriger l'utilisateur après la connexion
            // window.location.href = '/';
        }
    };

    const RegisterForm = () => {
        const [credentials, setCredentials] = useState({ username: '', password: '', role:'' });
        const [error, setError] = useState(null);

        const handleRegister = async (e) => {
            e.preventDefault();
            setError(null);

            try {
                const response = await fetch('/api/auth/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                });

                if (response.ok) {
                    // Rediriger l'utilisateur après l'inscription (vous pouvez ajuster la redirection selon vos besoins)
                    await signIn('credentials', {
                        username: credentials.username,
                        password: credentials.password,
                        role: credentials.role,
                        redirect: false,
                    });
                    // window.location.href = '/';
                } else {
                    const data = await response.json();
                    setError(data.error || 'Une erreur s\'est produite lors de la création de l\'utilisateur.');
                }
            } catch (error) {
                setError('Une erreur s\'est produite lors de la création de l\'utilisateur.');
            }
        };

        return (
            <div>
                <h1>Créer un nouvel utilisateur</h1>
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Nom utilisateur</label>
                        <input
                            className="form-control-plaintext"
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Mot de passe</label>
                        <input
                            className="form-control-plaintext"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Rôle</label>
                        <select
                            className="form-select"
                            name="role"
                            value={credentials.role}
                            onChange={handleChange}
                        >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>
                    <div className="mt-4">
                    </div>
                    <button className="btn btn-outline-primary" type="submit">Créer un utilisateur</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    };

        return (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Connexion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleLogin}>
                            <div>
                                <label>Nom utilisateur</label>
                                <input
                                    className="form-control-plaintext"
                                    type="text"
                                    name="username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Mot de passe</label>
                                <input
                                    className="form-control-plaintext"
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button className="btn btn-outline-primary"
                                    type="submit">
                                Se connecter</button>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
}

export default LoginModal;