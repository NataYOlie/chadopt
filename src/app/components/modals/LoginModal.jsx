import "./modals.css";
import { Modal, Button } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {signIn, signOut} from 'next-auth/react';
import { useSession } from "next-auth/react";
import { set } from "mongoose";

const LoginModal = ({ show, handleClose }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const { data: session, status } = useSession()
    const [toggleCreateForm, setToggleCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setInfo("chargement en cours...")

        const result = await signIn('credentials', {
            ...credentials,
            redirect: false
        });

        if (result.error) {
            setError('Nom d\'utilisateur ou mot de passe incorrect.');
            setInfo(null)

        } else {
            setInfo("Bonjour " + session?.user?.username)
            handleClose();
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        const newUser = { username: credentials.username, password: credentials.password };
        try {
            const response = await fetch("/api/auth/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const returnedUser = await response.json();
            console.log('New cat:', returnedUser);
            setInfo("Votre compte a été créé")

            // Se connecter après la création du compte
            const signInResult = await signIn('credentials', {
                ...newUser,
                redirect: false,
            });

            // Vérifier si la connexion est réussie
            if (signInResult.error) {
                setError("Erreur lors de la connexion après la création du compte.");
                setInfo(null);
            } else {
                // Fermer le modal après la connexion
                setTimeout(() => {
                    handleClose();
                }, 2000);
            }

        } catch (error) {
            console.error('Error creating account:', error);
        }
    }


        return (
                <Modal show={show} onHide={handleClose} className="modal-container">
                    <Modal.Header>
                    <button className="btn"
                            onClick={handleClose}>
                            Fermer
                        </button>
                        <Modal.Title>Connexion</Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleLogin}>
                            <div>
                                <label>Nom utilisateur</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    name="username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Mot de passe</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {info && <p style={{ color: 'gray' }}>{info}</p>}

                       
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="btn-group">
                        <button className="btn"
                                onClick={handleLogin}>
                            Se connecter
                        </button>
                         {/* Ou créer un compte */}
                         <div className="create-account">         
                        <button className="btn" 
                                onClick={(e)=>handleCreateAccount(e)}>
                            Créer un compte
                        </button>
                        </div>
                        </div>
                    </Modal.Footer>
                </Modal>
            );
}

export default LoginModal;