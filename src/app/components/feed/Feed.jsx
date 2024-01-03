"use client";
import "./feed.css";
import CatCard from "@/app/components/catCard/CatCard";
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";

const CatCardList = ({ data }) => {
    return (
        <div className='card-container'>
            {data.map((cat) => (
                console.log(cat),
                <CatCard
                    key={cat._id}
                    cat={cat}
                />
            ))}
        </div>
    );
};

const Feed = () => {

    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState(true); // État pour suivre le chargement

    const fetchAllCats = async () => {
        const response = await fetch("/api/cat");
        const data = await response.json();
        setAllCats(data);
        setLoading(false);
    };

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
            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <CatCardList data={allCats} />
            )}
            {/*<Button onClick={insertCat}>Insert Cat</Button>*/}
            {/*<Button onClick={insertUser}>Insert User</Button>*/}
        </div>
    )
}

export default Feed