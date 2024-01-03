import { Modal, Button } from 'react-bootstrap';

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

const CatModal = ({ cat, show, handleClose }) => {


    function handleSave() {
        // TODO : Sauvegarder les modifications du chat
        handleClose();
    }

    return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{cat.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{cat.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>

                    {/*ADMIN peut modifier les informations du chat*/}
                    <Button variant="primary" onClick={handleSave}>
                        Sauvegarder
                    </Button>


                </Modal.Footer>
            </Modal>
        );
}

export default CatModal;