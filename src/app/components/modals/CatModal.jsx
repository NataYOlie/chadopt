import "./modals.css";
import {catAge} from "@/utils/catAge";
import {catStatus} from "@/utils/catStatus";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import { Modal, Button } from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faMars, faPenToSquare, faVenus} from "@fortawesome/free-solid-svg-icons";



const CatModal = ({ user, cat, show, handleClose, handleSave, handleDelete, handleAdopt, handleCreate, handlePatchApplication,
                      getUserByApplicationId, errorMessage, setErrorMessage}) => {
    const session = useSession();

    // Définir des états pour les champs éditables
    const [editedName, setEditedName] = useState(cat.name);
    const [editedDescription, setEditedDescription] = useState(cat.description);
    const [editedCity, setEditedCity] = useState(cat.city);
    const [applicationStatus, setApplicationStatus] = useState(catStatus(cat));
    const [editedStatus, setEditedStatus] = useState(catStatus(cat));
    const [editedSex, setEditedSex] = useState(cat.sex || 'male');
    const [editedBirthdate, setEditedBirthdate] = useState(cat.birthdate);
    const [editedBreed, setEditedBreed] = useState(cat.breed);

    const [adoptUserList, setAdoptedUserList] = useState([]);

    //Definir l'état du mode Editing (Admin peut modifier)
    const [editing, setEditing] = useState(!cat._id);


//////////PRE CRUD ////////////////////////////////////////////////////////////////////////
    function handleSendToSave(cat) {
        const updatedCat = getUpdatedCat()
        const patchCat = { ...cat, ...updatedCat };
        handleSave(patchCat);
    }

    function handleSendToCreate(){
        const updatedCat = getUpdatedCat()
        handleCreate(updatedCat);
    }

    
    function handleSendToPatchApp(applicationid, status){
        const updatedStatus = status
        handlePatchApplication(applicationid, updatedStatus);
    }


    function getUpdatedCat (){
        const updatedCat = {
            name: editedName,
            description: editedDescription,
            city: editedCity,
            adoptionStatus: editedStatus, 
            sex: editedSex,
            birthdate: editedBirthdate,
            breed: editedBreed,
        };
        return updatedCat
    }

    function handleAdoptUser(applicationId) {
        getUserByApplicationId(applicationId)
            .then((user) => {
                console.log(user.username);
                adoptUserList.push(user);
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
            });
    }
/////////////RETURN //////////////////////////////////////////////////////////////////////
    return (
        <Modal show={show} onHide={handleClose} className="modal-container" >
            <Modal.Header>
                {editing? (
                    <>
                        <label htmlFor="name">Nom</label>
                        <input className="form-input" type="text" id="name" value={editedName}
                               onChange={(e) => setEditedName(e.target.value)} />
                    </>

                ) : (
                    <Modal.Title>{cat.name}</Modal.Title>
                )}
            </Modal.Header>
            <Modal.Body>
                {/*Bouton d'édition pour le mode ADMIN*/}
                {user && user.role === "admin" && (
                    // si le mode editing est activé mettre faPenToSquare sinon faEye
                    <div className="edit-button">
                        <FontAwesomeIcon className="edit-icon" icon={!editing? faPenToSquare : faEye} onClick={() => setEditing(!editing)}/>
                    </div>
                )}
                {editing? (
                    <div className="cat-photo-description">
                        <img src={cat.photo}
                             alt={cat.name} />
                        <textarea className="form-textarea" id="description" rows="3" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                    </div>
                ) : (
                    <div className="cat-photo-description">
                        <img src={cat.photo}
                             alt={cat.name} />
                        <div className="modal-description">
                            <p>{cat.description}</p>
                        </div>
                    </div>
                )}


                {/*MODE ADMIN EDITION OU MODE AFFICHAGE*/}
                {editing? (
                    <form className="form">
                        {/* Ajouter d'autres champs éditables ici */}
                        <label htmlFor="sex">Sexe</label>
                        <select className="form-input" id="sex" value={editedSex} onChange={(e) => setEditedSex(e.target.value)}>
                            <option value="male">Mâle</option>
                            <option value="female">Femelle</option>
                        </select>
                        <label htmlFor="birthdate">Date de naissance</label>
                        {/*par defaut mettre la date cat.birthdate*/}
                        <input className="form-input" type="date" id="birthdate" value={editedBirthdate || cat.birthdate}
                               onChange={(e) => setEditedBirthdate(e.target.value)} />
                        <label htmlFor="city">Ville</label>
                        <input className="form-input" type="text" id="city" value={editedCity}
                               onChange={(e) => setEditedCity(e.target.value)} />
                        <label htmlFor="breed">Race</label>
                        <select
                            className="form-input"
                            id="breed"
                            value={editedBreed}
                            onChange={(e) => setEditedBreed(e.target.value)}
                        >
                            <option value="">Selectionner une Race</option>
                            <option value="Balinais">Balinais</option>
                            <option value="Siamois">Siamois</option>
                            <option value="British long hair">British long hair</option>
                            <option value="British short hair">British short hair</option>
                            <option value="Main Coon">Main Coon</option>
                            <option value="Européen">Européen</option>
                            <option value="Angora">Angora</option>
                        </select>
                        <label htmlFor="status">Statut d&apos;adoption</label>
                        {catStatus(cat) === "demande en cours" ? (
                            <>
                                <p>{cat.name} a {cat.applications.length} demande(s) en cours</p>
                                {/* map les demandes d'adoptions du cat.applications */}
                                {cat.applications.map((application, index) => (
                                    <div key={application._id}>
                                        <label>Date de demande d'adoption</label>
                                        <p>{new Date(application.applicationDate).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}</p>
                                        <div>
                                            <div>
                                            {/* Call handleAdoptUser to fetch and store user data */}
                                                {handleAdoptUser(application._id)}
                                            </div>
                                            {/* Display the user data for each application */}
                                            {adoptUserList?.length > 0 && (
                                                <p key={index}> par {adoptUserList[index]?.username}</p>
                                            )}
                                                
                                        </div>
                                        <p>{application._id}</p>
                                        <p>{application.applicationStatus}</p>
                                        {/* pour chaque proposer un select afin de changer le statut de l'application */}
                                        {application.applicationStatus === "Acceptée" && (
                                            <>
                                                <button type="button" onClick={() => handleSendToPatchApp(application._id, "Rejetée")}>
                                                    Rejeter la demande
                                                </button>
                                                <button type="button" onClick={() => handleSendToPatchApp(application._id, "En attente")}>Mettre en attente</button>
                                            </>
                                        )}
                                        {application.applicationStatus === "Rejetée" && (
                                            <>
                                                <button type="button" onClick={() => handleSendToPatchApp(application._id, "Acceptée")}>
                                                    Accepter la demande
                                                </button>
                                                <button type="button" onClick={() => handleSendToPatchApp(application._id, "En attente")}>
                                                    Mettre en attente
                                                </button>
                                            </>
                                        )}
                                        {application.applicationStatus === "En attente" && (
                                            <>
                                                <button type="button" onClick={() => handleSendToPatchApp(application._id, "Acceptée")}>Accepter la demande</button>
                                                <button type="button" onClick={() => handleSendToPatchApp(application._id, "Rejetée")}>
                                                    Rejeter la demande
                                                </button>
                                            </>
                                        )}
                                        <select
                                            className="form-input"
                                            id="status"
                                            value={applicationStatus || application.applicationStatus}
                                            onChange={(e) => setApplicationStatus(e.target.value)}
                                        >
                                            <option value="Acceptée">Acceptée</option>
                                            <option value="En attente">En attente</option>
                                            <option value="Rejetée">Rejetée</option>
                                        </select>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {cat?.adoptionStatus}
                            </>
                        )}
                    </form>

                ) : (
                    <div className="cat-info">
                        {cat.sex === "male" ? (
                            <div className="cat-sex">
                                <FontAwesomeIcon id='fa' icon={faMars}/>
                                <p>Mâle</p>
                            </div>

                        ) : (
                            <div className="cat-sex">
                                <FontAwesomeIcon id='fa' icon={faVenus}/>
                                <p>Femelle</p>
                            </div>
                        )}
                        <p>🏙️ {cat.city}</p>
                        <p>🐈 {cat.breed}</p>
                        <p>🎂 {catAge(cat)}</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                {/* ADMIN MODE / Editing mode : Créer ou modifier un chat */}
                {editing && (
                    <div className="chadopt-group-btn" onClick={cat._id ? ()=>handleSendToSave(cat) : handleSendToCreate}>
                        <p className="chadopt-btn">{cat._id ? 'Modifie Moi !' : 'Crée Moi !'}</p>
                        <div className="button" id="button">{cat._id ? '🙀' : '😺'}</div>
                    </div>
                )}

                {/* Bouton de base */}
                {!editing && cat._id && catStatus(cat) !== "adopté" && (
                    <div className="chadopt-group-btn" onClick={() => handleAdopt(cat)}>
                        <p className="chadopt-btn">Chadopt&apos; Moi !</p>
                        <div className="button" id="button">😸</div>
                    </div>
                )}

                {/* Error message display */}
                <div className="error-message-div" onClick={() => setErrorMessage("")}>
                    <p className="error-message">{errorMessage}</p>
                </div>

                {/* Footer buttons */}
                <div className="footer-group-btn">
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>

                    {/* Delete button for editing mode and only when the cat has an ID to be hidden in create cat mode */}
                    {editing && cat._id && (
                        <Button variant="secondary" onClick={() => handleDelete(cat)}>
                            Supprimer ce chat
                        </Button>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default CatModal;