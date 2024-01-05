"use client"
import "./catcard.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faHeartCirclePlus, faMars, faVenus} from "@fortawesome/free-solid-svg-icons";
import {getSession, useSession, update} from "next-auth/react";
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
        setIsFavorite(user?.favorites?.some((favCat) => favCat._id === cat._id || favCat === cat._id) || false);
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

    const handleCardClick = () => {
        props.setShowCatModal(true);
        console.log("clic")
    };

    const handleToggleFavorite = async () => {
        const patchUser = { ...session.data.user };

        // Vérifier si le chat est déjà dans les favoris
        const isAlreadyFavorite = patchUser.favorites.some(favoriteCat => favoriteCat._id === cat._id
            || favoriteCat === cat._id);

        // Ajouter ou retirer le chat des favoris
        if (isAlreadyFavorite) {
            // Retirer le chat des favoris
            patchUser.favorites = patchUser.favorites.filter((favoriteCat) => {
                if (typeof favoriteCat === 'string' || favoriteCat instanceof String) {
                    // Si favoriteCat est une chaîne (cas de l'identifiant), comparer directement
                    return favoriteCat !== cat._id;
                } else if (favoriteCat && favoriteCat._id) {
                    // Si favoriteCat est un objet avec la propriété _id, comparer cette propriété
                    return favoriteCat._id !== cat._id;
                }
                // Si le format de favoriteCat n'est ni une chaîne ni un objet avec _id, le conserver dans le tableau
                return true;
            });
            console.log(patchUser.favorites[0])
            console.log(cat._id)
            console.log("Retirer le chat des favoris");

        } else {
            // Ajouter le chat aux favoris
            patchUser.favorites = [...patchUser.favorites, cat];
            console.log("Ajouter le chat aux favoris");
        }

        console.log(patchUser);
        console.log("patchUser");

        const response = await fetch("/api/user", {
            method: "PATCH",
            body: JSON.stringify(patchUser),
        });
        const data = await response.json();
        console.log("data")
        console.log(data)

        // Réinitialiser la session avec la version mise à jour
        await session.update({...session.data, user: data});
        console.log("session");
        console.log(session);
        setIsFavorite(!isFavorite);

    };

    return (
        <div className="card">
            <div className="card-top"
                 onClick={() => props.setShowCatModal(cat)}>
                <img src={cat.photo} alt={cat.name} >
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
            {/*Si le chat n'est pas adopté par le user */}
            <div className="chadopt-group-btn">
                <p className="chadopt-btn">Chadopt&apos; Moi !</p>
                <div class="button" id="button">😸</div>
            </div>

            {/*    Si le chat est adopté par le user*/}
            {cat.applications?.map((app) => app === user._id ? (
                <div className="chadopt-group-btn" key={app}>
                    <div className="button" id="button">😻</div>
                    <p className="chadopt-btn">Merci !</p>
                </div>
            ) : null)}
        </div>

    )
}

export default CatCard