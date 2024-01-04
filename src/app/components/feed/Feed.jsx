"use client";
import "./feed.css";
import CatCard from "@/app/components/catCard/CatCard";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";



const CatCardList = (props) => {
    return (
        <div className='card-container'>
            {props.data.map((cat) => (
                console.log(cat),
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
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [filteredCats, setFilteredCats] = useState([]);


    const fetchAllCats = async () => {
        const response = await fetch("/api/cat");
        const data = await response.json();
        setAllCats(data);
        setLoading(false);
    };

    useEffect(() => {
        const filterCats = () => {
            let catsToDisplay = [...allCats];

            if (showFavorites) {
                // Filtrer par favoris
                catsToDisplay = catsToDisplay.filter((cat) =>
                    session.data?.user?.favorites?.includes(cat._id)
                );
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



    const insertCat = async () => {
        const response = await fetch("/api/cat/new", {
            method: "POST",
            body: JSON.stringify({
                name: "Félicie",
                birthdate : "2022-07-01",
                sex : "female",
                breed :"British long hair",
                city : "Carry-le-Rouet",
                description: "Félicie est douce et câline, elle aime les personnes âgées et les canapés en velour côtelé",
            }),
        });

        const data = await response.json();
        console.log(data);
    };

    const insertUser = async () => {
        const response = await fetch("/api/auth/create", {
            method: "POST",
            body: JSON.stringify({
                username: "user",
                password: "us3r",
                role: "user",
                }),
        });

        const data = await response.json();
        console.log(data);
    };

    useEffect(() => {
        fetchAllCats();
    }, []);


    return (
        <div className="feed-container">
            <div className="chadopt-description">
                <p>Adopter un chat, c'est déclencher une avalanche de câlins et de moments #Adorables.
                    Choisissez la #VoieduCœur en sauvant une vie poilue. Oubliez les boutiques,
                    optez pour l'amour #AdoptDontShop.
                    Transformez votre feed en paradis félin avec un #ChatAdopté. 💖🐾 #ChadoptLove</p>
            </div>
            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
            >
                <option value="All">All Cities</option>
                {/* Ajoutez les options de ville en fonction des chats existants */}
                {/* Vous pouvez obtenir toutes les villes distinctes avec une logique appropriée */}
            </select>
            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
            >
                <option value="All">All Status</option>
                <option value="Adopted">Adopted</option>
                <option value="Available">Available</option>
                {/* Ajoutez d'autres options de statut au besoin */}
            </select>
            <label>
                <input
                    type="checkbox"
                    checked={showFavorites}
                    onChange={() => setShowFavorites(!showFavorites)}
                />
                Show Favorites
            </label>
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