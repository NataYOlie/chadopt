"use client";
import "./feed.css";
import CatCard from "@/app/components/catCard/CatCard";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import CatModal from "@/app/components/modals/CatModal";
import {catStatus} from "@/utils/catStatus";

/**
 * Crée les cards pour chaque chat
 */
const CatCardList = ({data, user, setShowCatModal, handleClose, getUserByApplicationId}) => {
    return (
        <div className='card-container'>
            {data && data.length > 0 ? (
                data.map((cat) => (
                    <CatCard
                        key={cat._id}
                        cat={cat}
                        user={user}
                        handleClose={handleClose}
                        setShowCatModal={setShowCatModal}
                        getUserByApplicationId={getUserByApplicationId}
                    />
                ))
            ) : (
                <p>No cats to display</p>
            )}
        </div>
    );
};

/**
 * Page principale
 */
const Feed = () => {
    const session = useSession();
    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState(true); // État pour suivre le chargement
    const [showFavorites, setShowFavorites] = useState(false); // État pour filtrer par favoris
    const [selectedCity, setSelectedCity] = useState('All');
    const [cities, setCities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [statuses, setStatuses] = useState([]);
    const [filteredCats, setFilteredCats] = useState([]);
    const [showCatModal, setShowCatModal] = useState(false);
    const [modalCat, setModalCat] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
    const [applicationCat, setApplicationCat] = useState(null);



    /**
     * Récupère tous les chats de la base de données
     */
    useEffect(() => {
        fetchAllCats();

    }, []);


    /**
     * Liste les villes et les statuts des chats pour hydrater le formulaire
     */
    useEffect(() => {
        setFormCities();
        setFormStatuses();
    },[allCats, setAllCats])

    /**
     * Applique les filtres de tris et met à jour l'affichage
     */
    useEffect(() => {
        const filterCats = () => {
            let catsToDisplay = [...allCats];

            if (showFavorites) {
                // Si  session.data?.user?.favorites? est un array d'ID
                if (session.data?.user?.favorites[0] && typeof session.data?.user?.favorites[0] === 'string') {
                        // Filtrer par favoris (ARRAY D'ID
                        catsToDisplay = catsToDisplay.filter((cat) =>
                        session.data?.user?.favorites?.includes(cat._id)
                    );
            } else {
                    // Sinon, si c'est un array d'objets :
                    const favoriteIds = session.data?.user?.favorites?.map(favorite => favorite._id);
                    // Filtrer par favoris
                    catsToDisplay = catsToDisplay.filter((cat) =>
                        favoriteIds?.includes(cat._id)
                    );
                }
            }

            if (selectedCity !== 'All') {
                // Filtrer par ville
                catsToDisplay = catsToDisplay.filter((cat) => cat.city === selectedCity);
            }

            if (selectedStatus !== 'All') {
                // Filtrer par statut
                catsToDisplay = catsToDisplay.filter(
                    (cat) => catStatus(cat) === selectedStatus
                );
            }

            if (applicationCat) {
                // Si un chat est mis en avant par le module user d'adoption (le chat est en cours d'adoption par le
                // user), il est retiré de la liste
                catsToDisplay = catsToDisplay.filter((cat) => cat._id !== applicationCat._id);
            }

            setFilteredCats(catsToDisplay);
        };
        filterCats();
    }, [allCats, showFavorites, selectedCity, selectedStatus, session.data?.user, applicationCat]);

    /**
     * Recherche le chat correspondant à la demande d'adoption du user
     */
    useEffect(() => {
        getApplicationCat()

    }, [session, allCats]);

    const getApplicationCat = async () => {
        const userApplicationId = session?.data?.user?.application?._id;

        if (userApplicationId) {
            const foundCat = allCats.find((cat) =>
                cat.applications.some((app) => app._id === userApplicationId)
            );
            if (foundCat) {
                await setApplicationCat(foundCat);
                return foundCat;
            } else setApplicationCat(null); // Reset applicationCat if no cat is found
        }
    };



//////////// METHODES FORMULAIRE TRI /////////////////////////////////////////////////////////////////////////////////
    const setFormCities = () => {
        const cities = [...new Set(allCats.map((cat) => cat.city))];
        setCities(cities);
    };

    const setFormStatuses = async () => {
        const updatedCats = allCats.map((cat) => {
            return {
                ...cat,
                adoptionStatus: catStatus(cat),
            };
        });
        const statuses = [...new Set(updatedCats.map((cat) => cat.adoptionStatus))];
        setStatuses(statuses);
    }


////////// METHODES MODAL //////////////////////////////////////////////////////////////////////
    const handleCloseModal = () => {
        setModalCat(null)
        setShowCatModal(false);
    };

    function showCatModalSetter(cat){
        setModalCat(cat)
        setShowCatModal(true)
    }

/////////////////////////CRUD/////////////////////////////////////////////////////////////////////
    const fetchAllCats = async () => {
        const response = await fetch("/api/cat");
        const data = await response.json();
        setAllCats(data);
        setLoading(false);
    };
    async function handleSave(cat) {
        try {
            const response = await fetch(`/api/cat/${cat._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cat),
            });

            if (!response.ok) {
                throw new Error(`Failed to update cat: ${response.statusText}`);
            }

            const patchCat = await response.json();
            console.log('Updated cat:', patchCat);
            setErrorMessage("Chat mis à jour !")

            //mettre un timer pour un reload 2sc pour mettre à jour les chats
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error updating cat:', error);
        }
    }

    async function handleCreate(cat) {
        console.log("create cat")
        try {
            const response = await fetch("/api/cat/new", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cat),
            });

            const newCat = await response.json();
            console.log('New cat:', newCat);
            setErrorMessage("Nouveau chat ajoute")
            //mettre un timer pour un reload 2sc pour mettre à jour les chats
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Error creating cat:', error);
        }
    }


    function handleDelete(cat) {
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
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                })
                .catch((error) => {
                    console.error('Error deleting cat:', error);
                });
        }
    }

    async function handleAdopt(cat) {
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

                //mettre un timer pour un reload 2sc pour mettre à jour les chats
                setTimeout(window.location.reload(), 2000);

            }catch (error) {
                console.error('Error creating application:', error);
                setErrorMessage("Une erreur est survenue")
            }
        }
    }

    async function handleDeleteApplication(application) {
        // Etes vous sur de vouloir supprimer cette adoption ?
        const confirmDelete = window.confirm("Etes vous sur de vouloir supprimer cette adoption ?");

        const cat = applicationCat;
        const user = session?.data?.user;

        if (confirmDelete) {
            try {
                const response = await fetch(`/api/application/${application._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({cat, user}),
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete application : ${response.statusText}`);
                    setErrorMessage("Une erreur est survenue - la demande n'a pas pu être supprimée")
                }else {
                    setErrorMessage("Adoption annulée")
                    // Réinitialiser la session avec la version mise à jour
                    await session.update({
                        ...session.data,
                        user: {
                            ...session.data.user,
                            application: null,
                        }
                    });
                    setApplicationCat(null)

                    //mettre un timer pour un reload 2sc pour mettre à jour les chats
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }

            }catch (error) {
                console.error('Error creating application:', error);
                setErrorMessage("Une erreur est survenue")
            }
        }
    }

    async function getUserByApplicationId(applicationid){
        const response = await fetch(`/api/application/${applicationid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const user = await response.json();

        return user
    }

    async function handlePatchApplication(applicationid, status) {
        console.log("PATCH APPLICATION")

        console.log(applicationid) //OK renvoie 6599ba1ec8b4c608761fa20e
        console.log(status) //OK renvoie Acceptée
        
        try {
            const response = await fetch(`/api/application/${applicationid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(status),
            });
    
            const data = await response.json();
            console.log("PATCH APPLICATION data");
            console.log(data);
    
            setErrorMessage(`Demande enregistrée comme ${status} !`);
            return data;

        } catch (error) {
            console.error("Error patching application:", error);
            // Handle the error as needed
            setErrorMessage("Failed to patch application. Please try again.");
        }
    }


/////////////////////////////////////RETURN/////////////////////////////////////////////////////////////////////
    return (
        <div className="feed-container">
            <div className="chadopt-description">
                <p>Adopter un chat, c&apos;est déclencher une avalanche de câlins et de moments #Adorables.
                    Choisissez la #VoieduCœur en sauvant une vie poilue. Oubliez les boutiques,
                    optez pour l&apos;amour #AdoptDontShop.
                    Transformez votre feed en paradis félin avec un #ChatAdopté. 💖🐾 #ChadoptLove</p>
            </div>




            {session?.data?.user?.role === "admin" && (
                <div className="feed-new-cat">
                    <button className="btn" onClick={showCatModalSetter}>🐈 Ajouter un chat 🐈</button>
                </div>
            )}
            <div className="chadopt-filtres">
                <div className="label-wrapper">
                    <label>Villes</label>
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="All">Tout voir</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div className="label-wrapper">
                    <label>Statut</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">Tout voir</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <label>
                    <input
                        type="checkbox"
                        checked={showFavorites}
                        onChange={() => setShowFavorites(!showFavorites)}
                    />
                    Afficher mes chats préférés
                </label>
            </div>









            <div className="user-chadopt-status">
                {/*AFFICHER LE CHAT QUI EST EN DEMANDE PAR LE USER*/}
                {session?.data?.user?.application && (
                    <>
                        <div className="chadopt-status">
                            <div className="chadopt-status">
                                <h1>😻</h1>
                                <h2>Vous avez une adoption en cours</h2>
                                <p>Statut : {session?.data?.user?.application?.applicationStatus}</p>
                            </div>

                            <div className="chadopt-status" id="status-info">
                                <p>Vous devez attendre d&apos;avoir adopté <b>{applicationCat?.name}</b> avant de pouvoir adopter un
                                    nouveau compagnon</p>
                            </div>

                            <div className="chadopt-group-btn" id="desadoptMoi" onClick={()=>handleDeleteApplication(session?.data?.user?.application)}>
                                <div className="button" id="desadoptMoi-button">😿</div>
                                <p className="button">Annuler ma demande d&apos;adoption</p>
                            </div>
                        </div>

                        {applicationCat && (
                            <div className='card-container-adoption'>
                                <CatCard
                                    cat={applicationCat}
                                    key={applicationCat._id}
                                    user={session?.data?.user}
                                    setShowCatModal={showCatModalSetter}
                                    handleClose={handleCloseModal}
                                    getUserByApplicationId={getUserByApplicationId}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>





            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <CatCardList data={filteredCats} setShowCatModal={showCatModalSetter}
                             handleClose={handleCloseModal} getUserByApplicationId={getUserByApplicationId}/>
            )}






            <div className="flex">
                {showCatModal && <CatModal user={session.data?.user}
                                           show={showCatModalSetter}
                                           handleSave={handleSave}
                                           handleDelete={handleDelete}
                                           handleAdopt={handleAdopt}
                                           handleClose={handleCloseModal}
                                           getUserByApplicationId={getUserByApplicationId}
                                           cat={modalCat}
                                           handleCreate={handleCreate}
                                           handlePatchApplication={handlePatchApplication}
                                           errorMessage={errorMessage}
                                           setErrorMessage={setErrorMessage}/>}
            </div>
        </div>
    )
}

export default Feed