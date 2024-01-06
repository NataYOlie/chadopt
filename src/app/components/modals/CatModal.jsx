import { Modal, Button } from 'react-bootstrap';
import {catAge} from "@/utils/catAge";
import "./modals.css";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faMars, faPenToSquare, faVenus} from "@fortawesome/free-solid-svg-icons";
import {useSession} from "next-auth/react";
import {catStatus} from "@/utils/catStatus";
import {useRouter} from "next/router";

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
    const session = useSession();

    // Définir des états pour les champs éditables
    const [editedName, setEditedName] = useState(cat.name);
    const [editedDescription, setEditedDescription] = useState(cat.description);
    const [editedCity, setEditedCity] = useState(cat.city);
    const [editedStatus, setEditedStatus] = useState(catStatus(cat));
    const [editedSex, setEditedSex] = useState(cat.sex);
    const [editedBirthdate, setEditedBirthdate] = useState(cat.birthdate);
    const [editedBreed, setEditedBreed] = useState(cat.breed);
    const [errorMessage, setErrorMessage] = useState('');

    //Definir l'état du mode Editing
    const [editing, setEditing] = useState(false);

    async function handleSave() {
        // PATCH du chat dans la base de données
        const updatedCat = {
            ...cat,
            name: editedName,
            description: editedDescription,
            city: editedCity,
            adoptionStatus: editedStatus, // Correction du nom du champ
            sex: editedSex,
            birthdate: editedBirthdate,
            breed: editedBreed,
        };

        try {
            const response = await fetch(`/api/cat/${cat._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCat),
            });

            if (!response.ok) {
                throw new Error(`Failed to update cat: ${response.statusText}`);
            }

            const patchCat = await response.json();
            console.log('Updated cat:', patchCat);
            setErrorMessage("Chat mis à jour !")

            //mettre un timer pour un reload 2sc pour mettre à jour les chats
            setTimeout(window.location.reload(), 2000);


        } catch (error) {
            console.error('Error updating cat:', error);
        }
    }
    function handleDelete() {
        // Etes vous sur de vouloir supprimer ce chat ?
        const confirmDelete = window.confirm("Etes vous sur de vouloir supprimer ce chat ?");

        if (confirmDelete) {
            // DELETE du chat dans la base de données
            fetch(`/api/cat/${cat._id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to delete cat: ${response.statusText}`);
                    }
                    console.log('Cat deleted successfully');
                    handleClose();
                })
                .catch((error) => {
                    console.error('Error deleting cat:', error);
                });
        }
    }

    async function handleAdopt() {
        const user = session?.data?.user;
        console.log("HANDLE ADOPT user")
        console.log(user)
        if (user.application) {
            setErrorMessage("Vous avez déjà una adoption en cours !")
        }else {
            try {
                const response = await fetch(`/api/application/new`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({cat, user}),
                });

                if (!response.ok) {
                    throw new Error(`Failed to create application : ${response.statusText}`);
                    setErrorMessage("Une erreur est survenue")
                }else {
                    setErrorMessage("Demande transmise !")
                }
                const data = await response.json();
                console.log("CREATE APPLICATION data")
                console.log(data)

                // Réinitialiser la session avec la version mise à jour
                const updatedUser = { ...user, application: data};
                await session.update({ ...session.data, user: updatedUser });
                console.log("session");
                console.log(session);

                //FERMER CatModal
                handleClose();

            }catch (error) {
                console.error('Error creating application:', error);
                setErrorMessage("Une erreur est survenue")
            }

        }

        //Envoyer AdoptModal pour valider le statut d'adoption
    }

    return (
        <Modal show={show} onHide={handleClose} className="modal-container">
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

                        {/*SI disponible ALORS on peut changer le statut pour une demande d'adoption par un user*/}
                        {/*Si demande en cours ALORS on peut changer le statut de la demande*/}
                        {/*Si adopté ALORS ne peut rien faire*/}

                        <select className="form-input" id="status" value={editedStatus}
                                onChange={(e) => setEditedStatus(e.target.value)}>
                            <option value="disponible">A Adopter</option>
                            <option value="demande en cours">Demandes en cours</option>
                            <option value="adopté">Adopté</option>
                        </select>
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
                {/*MODE ADMIN EDITION OU MODE AFFICHAGE*/}
                {editing ? (
                    <>
                        <div className="chadopt-group-btn" onClick={handleSave}>
                            <p className="chadopt-btn">Modifie Moi !</p>
                            <div class="button" id="button">🙀</div>
                        </div>

                    </>
                ) : (
                    <div className="chadopt-group-btn" onClick={handleAdopt}>
                        <p className="chadopt-btn">Chadopt&apos; Moi !</p>
                        <div class="button" id="button">😸</div>
                    </div>

                )}
                <div className="error-message-div" onClick={()=>setErrorMessage("")}>
                <p className="error-message"> {errorMessage} </p>
                </div>
                <div className="footer-group-btn">
                <Button variant="secondary" onClick={handleClose}>
                    Fermer
                </Button>
                    {editing && (
                        <Button variant="secondary" onClick={handleDelete}>
                            Supprimer ce chat
                        </Button>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default CatModal;