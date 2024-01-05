import { Modal, Button } from 'react-bootstrap';
import "./modals.css";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faMars, faPenToSquare, faVenus} from "@fortawesome/free-solid-svg-icons";

//Cliquer sur un chat pour obtenir l'ensemble des informations (via une modale)
//ADMIN peut modifier les informations du chat
/*
    1 - Un nom
    2 - Un date de naissance (donc un âge)
    3 - Un race
    4 - Un sexe
    5 - Une ville
    6 - Une description
    7 - Une photo
    8 - Un statut d'adoption
 */

const CatModal = ({ user, cat, show, handleClose }) => {

    // Définir des états pour les champs éditables
    const [editedName, setEditedName] = useState(cat.name);
    const [editedDescription, setEditedDescription] = useState(cat.description);
    const [editedCity, setEditedCity] = useState(cat.city);
    const [editedStatus, setEditedStatus] = useState(cat.adoptionStatus);
    const [editedSex, setEditedSex] = useState(cat.sex);
    const [editedBirthdate, setEditedBirthdate] = useState(cat.birthdate);
    const [editedBreed, setEditedBreed] = useState(cat.breed);

    //Definir l'état du mode Editing
    const [editing, setEditing] = useState(false);

    function handleSave() {
        // TODO : Sauvegarder les modifications du chat
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleClose} className="modal-container">
            <Modal.Header>
                <Modal.Title>{cat.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/*Bouton d'édition pour le mode ADMIN*/}
                {user && user.role === "admin" && (
                    // si le mode editing est activé mettre faPenToSquare sinon faEye
                    <div className="edit-button">
                        <FontAwesomeIcon className="edit-icon" icon={!editing? faPenToSquare : faEye} onClick={() => setEditing(!editing)}/>
                    </div>
                )}
                <img src={cat.photo}
                     alt={cat.name} />



                {/*MODE ADMIN EDITION OU MODE AFFICHAGE*/}
                {setEditing === true ? (
                    <>
                    </>
                ) : (
                    <>
                        {cat.sex === "male" ? (
                            <FontAwesomeIcon icon={faMars}/>
                        ) : (  <FontAwesomeIcon icon={faVenus}/>)}
                        <p>{cat.description}</p>
                    </>
                )}


            </Modal.Body>
            <Modal.Footer>
                {/*MODE ADMIN EDITION OU MODE AFFICHAGE*/}
                {setEditing === true ? (
                    <>
                    </>
                ) : (
                    <div className="chadopt-group-btn">
                        <p className="chadopt-btn">Chadopt&apos; Moi !</p>
                        <div class="button" id="button">😸</div>
                    </div>

                )}

                <Button variant="secondary" onClick={handleClose}>
                    Fermer
                </Button>

                {/*ADMIN peut modifier les informations du chat*/}
                {editing && (
                    <Button variant="primary" onClick={handleSave}>
                        Sauvegarder
                    </Button>
                )}


            </Modal.Footer>
        </Modal>
    );
}

export default CatModal;