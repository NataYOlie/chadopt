"use client";
import "./nav.css";
import {signIn, signOut, useSession, getProviders} from "next-auth/react";
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
                    <p>Connecté.e en tant que {session.user.username}</p>
                    <button className="btn btn-primary" onClick={() => signOut()}>Se déconnecter</button>
                </div>
            );
        } else return <p>{status}</p>;
    };

    return (
        <div className="nav-container">
                <div className="container-fluid">
                    <div>
                        {statusInfo()}
                    </div>
                    <div className="logo">
                        <img src="pet_512.png"/>
                        <h1>Chadopt'</h1>
                    </div>
                    {session ? ( <div>
                        <FontAwesomeIcon icon={faUser}/>
                        {" " + session?.user?.username}
                        <button className="btn btn-secondary" onClick={() => signOut()}>
                            <FontAwesomeIcon icon={faRightFromBracket}/>
                        </button>
                    </div>) : (
                        <div className={"flex"}>
                            <p onClick={handleLoginClick}>Login</p>
                            {showLoginModal && <LoginModal show={showLoginModal} handleClose={handleCloseModal} />}
                        </div>)
                    }

                </div>
        </div>
    )
}



export default Nav