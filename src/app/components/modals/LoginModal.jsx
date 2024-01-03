import "./modals.css";
import { Modal, Button } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {signIn, signOut} from 'next-auth/react';
import { useSession } from "next-auth/react";

const LoginModal = ({ show, handleClose }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const { data: session, status } = useSession()



    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setInfo("loading...")
        console.log("HANDLE LOGIN")
        console.log(credentials)

        const result = await signIn('credentials', {
            ...credentials,
            redirect: false
        });

        if (result.error) {
            console.log("login result error");
            setError('Nom d\'utilisateur ou mot de passe incorrect.');
            setInfo(null)

        } else {
            console.log("login ok : " + result.ok);
            console.log(session?.user)
            setInfo("Bonjour " + session?.user?.username)
            handleClose();
        }
    };

        return (
                <Modal show={show} onHide={handleClose} className="modal-container">
                    <Modal.Header>
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
                        <button className="btn"
                                onClick={handleClose}>
                            Fermer
                        </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            );
}

export default LoginModal;