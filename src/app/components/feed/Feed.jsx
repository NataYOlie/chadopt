"use client";
import "./feed.css";
import CatCard from "@/app/components/catCard/CatCard";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";



const CatCardList = (props) => {
    return (
        <div className='card-container'>
            {props.data.map((cat) => (
                <CatCard
                    key={cat._id}
                    cat={cat}
                    user={props.user}
                    setUser={props.setUser}
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
                    (cat) => cat.adoptionStatus === selectedStatus
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

    const setFormStatuses = () => {
        const statuses = [...new Set(allCats.map((cat) => cat.adoptionStatus))];
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
                <CatCardList data={filteredCats} user={session.data?.user} />
            )}
            {/*<Button onClick={insertCat}>Insert Cat</Button>*/}
            {/*<Button onClick={insertUser}>Insert User</Button>*/}
        </div>
    )
}

export default Feed