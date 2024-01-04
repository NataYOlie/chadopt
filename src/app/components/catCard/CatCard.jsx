"use client"
import "./catcard.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faHeartCirclePlus, faMars, faVenus} from "@fortawesome/free-solid-svg-icons";
import {getSession, useSession} from "next-auth/react";
import {useEffect, useState} from "react";


const CatCard = (props) => {
    const session = useSession();
    const user = session.data?.user;
    const cat = props.cat;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        displayFavCats();
    },[session]);

    useEffect(() => {
        console.log("user", user);
        console.log("cat", cat._id);
        setIsFavorite(user?.favorites?.some((favCat) => favCat._id === cat._id) || false);
    }, [user, cat]);

    const catAge = () => {
        //calculer l'age du chat à partir de sa date de naissance
        const birthdate = new Date(cat.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const month = today.getMonth() - birthdate.getMonth();
            if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
                age--;
            //si moins de 1 an, envoyer age en mois
            if(age < 1){
                age = Math.round((today - birthdate) / (30 * 24 * 60 * 60 * 1000));
                return age + " mois";
            }
            //si moins de 1 mois, envoyer age en jours
            if(age < 1){
                age = Math.round((today - birthdate) / (24 * 60 * 60 * 1000));
                return age + " jours";
            }
            return age + " ans";
        }

    }

    const displayFavCats = () => {
        console.log(isFavorite);
        return (
            <div className="card-favorite">
                    <FontAwesomeIcon
                        icon={isFavorite ? faHeart : faHeartCirclePlus}
                        style={{ color: isFavorite ? "red" : "black", cursor: "pointer" }}
                        onClick={handleToggleFavorite}
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    />
            </div>
        )
    }

    const handleToggleFavorite = async () => {
        const patchUser = { ...session.data.user };
        // Vérifier si le chat est déjà dans les favoris
        const isAlreadyFavorite = patchUser.favorites.some(favoriteCat => favoriteCat._id === cat._id);

        // Mettez en œuvre la logique pour ajouter ou retirer le chat des favoris ici
        if (isAlreadyFavorite) {
            // Retirer le chat des favoris
            patchUser.favorites = patchUser.favorites.filter((favoriteCat) => favoriteCat._id !== cat._id);
            console.log("Retirer le chat des favoris");
        } else {
            // Ajouter le chat aux favoris
            patchUser.favorites = [...patchUser.favorites, cat];
            console.log("Ajouter le chat aux favoris");
        }
        // Mettre à jour l'utilisateur dans la session
        await getSession();
        console.log(session.data.user);

        const response = await fetch("/api/user", {
            method: "PATCH",
            body: JSON.stringify(patchUser),
        });
        const data = response.json();
        console.log(data);
        setIsFavorite(!isFavorite);
        displayFavCats();
    };

    return (
        <div className="card">
            <div className="card-top">
                <img src={`https://cataas.com/cat/says/${cat.name}?fontSize=20&fontColor=white&type=square`} alt={cat.name} >
                </img>
            </div>
            <div className="container">
                <div className="card-catName">
                    {user && (<div>
                        {displayFavCats()}
                    </div>)}
                <h3 className="card-title">{cat.name}</h3>
                </div>
                {cat.sex === "male" ? (
                    <FontAwesomeIcon icon={faMars}/>
                ) : (  <FontAwesomeIcon icon={faVenus}/>)}
            </div>
            <div className="container">
                <p>
                    {cat.city}
                </p>
                <p>
                    {user?.role === "admin" && (
                        <p> {cat.adoptionStatus}</p>
                    )
                    }
                </p>
                <p>{catAge()}</p>
            </div>
            <div className="description">
                <p>{cat.description}</p>
            </div>
        </div>
    )
}

export default CatCard