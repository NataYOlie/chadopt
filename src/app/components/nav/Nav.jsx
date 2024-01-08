"use client";
import "./nav.css";
import {signOut, useSession} from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import LoginModal from "../modals/LoginModal";
import {useState} from "react";

const Nav = () => {
    const {data: session, status} = useSession();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    const statusInfo = () => {
        if (status === 'authenticated' && session.user) {
            return (
                <div>
                    <p>Bonjour {session.user.username} !</p>
                    <button className="btn" onClick={() => signOut()}>Se déconnecter</button>
                </div>
            );
        } else return <p>{status}</p>;
    };

    return (
        <div className="nav-container">
                <div className="container-fluid">
                {session ? ( <div className="nav-session">
                        <p>
                            <FontAwesomeIcon icon={faUser} className="nav-faicon"/>    
                        </p>
                        <p>{" " + session?.user?.username}</p>
                        <p className="nav-logout" onClick={() => signOut()}>
                            <FontAwesomeIcon icon={faRightFromBracket} className="nav-faicon" onClick={() => signOut()}/>
                        </p>
                    </div>) : (
                        <>
                        {status === 'loading' && <p>Chargement de la session...</p>}
                        <div className="flex flex nav-session">
                            <p onClick={handleLoginClick}>Login</p>
                            {showLoginModal && <LoginModal show={showLoginModal} handleClose={handleCloseModal} />}
                        </div>
                        </>
                    )}


                    <div className="logo">
                        <img src="pet_512.png"/>
                        <h1>Chadopt'</h1>
                        <h4>Un amimal ne s'achète pas, il se Chadopt'!</h4>
                    </div>
                    

                </div>
        </div>
    )
}



export default Nav