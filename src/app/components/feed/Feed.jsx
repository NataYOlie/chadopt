"use client";
import "./feed.css";
import CatCard from "@/app/components/catCard/CatCard";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import LoginModal from "@/app/components/modals/LoginModal";
import CatModal from "@/app/components/modals/CatModal";
import {catStatus} from "@/utils/catStatus";


const CatCardList = (props) => {
    return (
        <div className='card-container'>
            {props.data.map((cat) => (
                <CatCard
                    key={cat._id}
                    cat={cat}
                    user={props.user}
                    setUser={props.setUser}
                    setShowCatModal={props.setShowCatModal}
                />
            ))}
        </div>
    );
};

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

    const handleLoginClick = () => {
        setShowCatModal(true);
    };


    const handleCloseModal = () => {
        setShowCatModal(false);
    };

    function showCatModalSetter(cat){
        setShowCatModal(true)
        setModalCat(cat)
    }


    const fetchAllCats = async () => {
        const response = await fetch("/api/cat");
        const data = await response.json();
        setAllCats(data);
        setLoading(false);
    };

    /**
     * Récupère tous les chats de la base de données
     */
    useEffect(() => {
        fetchAllCats();

    }, []);


    /**
     * Liste les villes et les statuts pour hydrater le formulaire
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

            setFilteredCats(catsToDisplay);
        };

        filterCats();
    }, [allCats, showFavorites, selectedCity, selectedStatus, session.data?.user]);


    const setFormCities = () => {
        const cities = [...new Set(allCats.map((cat) => cat.city))];
        setCities(cities);
        console.log("cities");
        console.log(cities);
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

    //
    //
    // const insertCat = async () => {
    //     const response = await fetch("/api/cat/new", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             name: "Félicie",
    //             birthdate : "2022-07-01",
    //             sex : "female",
    //             breed :"British long hair",
    //             city : "Carry-le-Rouet",
    //             description: "Félicie est douce et câline, elle aime les personnes âgées et les canapés en velour côtelé",
    //         }),
    //     });
    //
    //     const data = await response.json();
    //     console.log(data);
    // };
    //
    // const insertUser = async () => {
    //     const response = await fetch("/api/auth/create", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             username: "user",
    //             password: "us3r",
    //             role: "user",
    //             }),
    //     });
    //
    //     const data = await response.json();
    //     console.log(data);
    // };



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

            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <CatCardList data={filteredCats} user={session.data?.user} setShowCatModal={showCatModalSetter}
                             handleClose={handleCloseModal}/>
            )}
            {/*<Button onClick={insertCat}>Insert Cat</Button>*/}
            {/*<Button onClick={insertUser}>Insert User</Button>*/}

            <div className="flex">
                {showCatModal && <CatModal user={session.data?.user} show={showCatModalSetter}
                                           handleClose={handleCloseModal} cat={modalCat}/>}
            </div>

        </div>
    )
}

export default Feed