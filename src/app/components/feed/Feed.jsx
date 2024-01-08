"use client";
import "./feed.css";
import CatCard from "@/app/components/catCard/CatCard";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import CatModal from "@/app/components/modals/CatModal";
import {catStatus} from "@/utils/catStatus";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSliders} from "@fortawesome/free-solid-svg-icons";

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
                <p>Aucun chat ne correspond à vos option de filtrage</p>
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
    const [loading, setLoading] = useState(true); // État pour suivre le chargement du feed
    const [showFavorites, setShowFavorites] = useState(false); 
    const [selectedCity, setSelectedCity] = useState('All');
    const [cities, setCities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('disponible');//par défaut on ne voit que les chats disponibles
    const [statuses, setStatuses] = useState([]);
    const [filteredCats, setFilteredCats] = useState([]);
    const [showCatModal, setShowCatModal] = useState(false);
    const [modalCat, setModalCat] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
    const [applicationCatList, setApplicationCatList] = useState([]); //Pour les demandes d'adoption en cours du user
    const [toggleUserChadoptStatus, setToggleUserChadoptStatus] = useState(false); 



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

             // Si un chat est mis en avant par le module user d'adoption (le chat est en cours d'adoption par le
             // user), il est retiré de la liste
            if (applicationCatList && applicationCatList.length > 0) {
                applicationCatList.forEach((catApp) => {

                    catsToDisplay = catsToDisplay.filter((cat) => cat._id !== catApp._id);
                });
            }
            setFilteredCats(catsToDisplay);
        };
        filterCats();
    }, [allCats, showFavorites, selectedCity, selectedStatus, session.data?.user, applicationCatList]);

    /**
     * Recherche le chat correspondant à la demande d'adoption du user
     */
    useEffect(() => {
        getApplicationCatList() 

    }, [session, allCats]);

    const getApplicationCatList = async () => {

        const userApplications = session?.data?.user?.applications;

        if (userApplications && userApplications.length > 0) {
        
        // Récupérer les chats correspondant aux demandes d'adoption du user
            const catsWithApplications = allCats.filter((cat) =>
            cat.applications.some((app) => {
                const matchingUserApp = userApplications.find((userApp) => userApp._id === app._id);
                return matchingUserApp != null;
            })
        );
            
        // Ajouter le statut au chat
        catsWithApplications.forEach((cat) => {
            cat.adoptionStatus = catStatus(cat);
        });

        console.log("catsWithApplications") 
        console.log(catsWithApplications) 

        if (catsWithApplications.length > 0) {
            setApplicationCatList(catsWithApplications);
            return catsWithApplications;
        } else {
            setApplicationCatList([]); // Reset applicationCatList si pas de chats
        }
    } else {
        setApplicationCatList([]); // Reset applicationCatList si pas de chats
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
        console.log("close modal")
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


    /**
     * Créer un chat
     */
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


    /**
     * Modifier un chat 
     */
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


    /**
     * Supprimer un chat
     */
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

     /**
     * Créer une demande d'adoption
     */
    async function handleAdopt(cat) {
        const user = session?.data?.user;
        console.log("HANDLE ADOPT user")
        console.log(user)
       
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
                const updatedApplications = [...user.applications, data];

                // Réinitialiser la session avec la version mise à jour
                const updatedUser = { ...user, applications: updatedApplications};
                await session.update({ ...session.data, user: updatedUser });

                //mettre un timer pour un reload 2sc pour mettre à jour les chats
                setTimeout(window.location.reload(), 2000);

            }catch (error) {
                console.error('Error creating application:', error);
                setErrorMessage("Une erreur est survenue")
            }
        
    }

         
     /**
     * Modifier une demande d'adoption
     */
     async function handlePatchApplication(applicationid, status) {
        console.log("PATCH APPLICATION")

        console.log(applicationid)
        console.log(status) 
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

    
     /**
     * Supprimer une demande d'adoption
     */
    async function handleDeleteApplication(application,cat) {
        // Etes vous sur de vouloir supprimer cette adoption ?
        const confirmDelete = window.confirm("Etes vous sur de vouloir supprimer cette adoption ?");

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
                    const updatedUserApplications = user.applications.filter((app) => app._id !== application._id);
                    await session.update({
                        ...session.data,
                        user: {
                            ...session.data.user,
                            applications: updatedUserApplications,
                        }
                    });
                    // retirer le chat de la liste des chats en cours d'adoption
                    setApplicationCatList((prevList) =>
                      prevList.filter((appCat) => appCat._id !== cat._id)
                    );
                    //mettre un timer pour un reload 2sc pour mettre à jour les chats
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }

            }catch (error) {
                console.error('Error deleting application:', error);
                setErrorMessage("Une erreur est survenue")
            }
        }
    }

        
     /**
     * Récupérer un user depuis une demande d'adoption
     */
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

   
//////////////RETURN///////////////////////RETURN/////////////////////////////JSX////////////////////RETURN////////////////////

    return (
      <div className="feed-container">
          <div className="user-chadopt-status">
          {/* AFFICHER LES CHATS DANS LA LISTE D'APPLICATIONS */}
          {session?.data?.user?.applications &&
                applicationCatList.length > 0 && (
                    <div className="chadopt-status" onClick = {() => setToggleUserChadoptStatus(!toggleUserChadoptStatus)}>
                    <h1>😻</h1>
                    <h2>
                        Vous avez {applicationCatList.length} adoption(s) en cours
                    </h2>
                    </div>
                )}

          {session?.data?.user?.applications &&
            applicationCatList.length > 0 && toggleUserChadoptStatus && (
              <>

                <div className="card-container-adoption">
                  {applicationCatList.map((cat, index) => (
                    <div className="cards-adoption"
                    key={cat._id}>
                    <>
                        <b>Statut :</b>{" "}
                
                    {session?.data?.user?.applications[index]?.applicationStatus === "Acceptée" ? (
                        <span className="accepted" style={{fontWeight:"bold", color:"orange", backgroundColor:"yellow"}}>Acceptée ! </span>
                    ) : session?.data?.user?.applications[index]?.applicationStatus === "En attente" ? (
                        <span className="pending" style={{fontStyle:"italic"}}>En attente d'approbation par nos services</span>
                    ) : (
                        <span className="rejected" style={{fontWeight:"bold", color:"red"}}>Rejetée</span>
                    )}
                  </>
                      <CatCard
                        cat={cat}
                        key={cat._id}
                        user={session?.data?.user}
                        setShowCatModal={showCatModalSetter}
                        handleClose={handleCloseModal}
                        getUserByApplicationId={getUserByApplicationId}
                        applicationCatList={applicationCatList}
                      />
                      <div
                        className="chadopt-group-btn"
                        id="desadoptMoi"
                      >
                        {cat.adoptionStatus === "adopté" ? (
                            <>
                            <div className="button" id="desadoptMoi-button"
                            >
                            😽
                            </div>
                             <p>Je gratterai à ta porte dans quelques jours !</p>
                             </>
                    
                         
                        ) : (
                            <div onClick={() =>
                                handleDeleteApplication(
                                session?.data?.user?.applications[index], 
                                  cat
                                )
                              }>
                                {session?.data?.user?.applications[index]._id}
                            <div className="button" id="desadoptMoi-button"
                             >
                               😿
                             </div>
                             <p className="button">Annuler ma demande d'adoption</p>
                            </div>
                            )}
                         </div>
                    </div>
                  ))}
                </div>
              </>
            )}
        </div>
        <div className="chadopt-description">
            <img src="https://cataas.com/cat/says/Adopte Moi?fontSize=20&fontColor=white&type=square" />
            <div className="chadopt-description-text">
                <h3>L'adoption responsable est au coeur de la démarche Chadopt'</h3>
                <br/>
                <br/>
                <p>
                En offrant un foyer aimant à un compagnon adopté, vous écrivez une nouvelle histoire de bonheur partagé. 
                La compassion que vous investissez dans cette démarche se transforme en une aventure mutuelle, tissée de liens indéfectibles 
                et d'échanges enrichissants. Au-delà de l'acte altruiste, l'adoption devient une source inépuisable de joie, 
                apportant un équilibre harmonieux dans la vie de chacun. Opter pour l'adoption responsable, c'est créer un impact durable, 
                unissant destinées humaines et animales dans une symphonie de bonheur partagé. 
                <br/>
                </p>
                <br/>
                <h3>
                🐾💖 #AdoptionResponsable #Chadoptez
                </h3>
                
            </div>
        </div>


        {session?.data?.user?.role === "admin" && (
          <div className="feed-new-cat">
            <p> vous êtes connecté en tant qu'administrateur </p>
            <button className="btn newCatbtn" onClick={showCatModalSetter}>
              🐈 Ajouter un chat 🐈
            </button>
        
          </div>
        )}


        <div className="chadopt-filtres">
        <div className="chadopt-flitres-select">
          <div className="label-wrapper">
            <label>Villes</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All">Tout voir</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="feed label-wrapper">
            <label>Statut</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">Tout voir</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            </div>
          </div>

        <div className="chadopt-filtrez-fav">
          <label>
            <input
              type="checkbox"
              checked={showFavorites}
              onChange={() => setShowFavorites(!showFavorites)}
            />
            Afficher mes chats préférés
          </label>
          </div>
        </div>



      

        {loading ? (
          <p>Chargement en cours...</p>
        ) : (
          <CatCardList
            data={filteredCats}
            setShowCatModal={showCatModalSetter}
            handleClose={handleCloseModal}
            getUserByApplicationId={getUserByApplicationId}
            applicationCatList={applicationCatList}
          />
        )}

        <div className="flex">
          {showCatModal && (
            <CatModal
              user={session.data?.user}
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
              setErrorMessage={setErrorMessage}
            />
          )}
        </div>
      </div>
    );
}

export default Feed