"use client"
import "./catcard.css"
import {catAge} from "@/utils/catAge";
import {catStatus} from "@/utils/catStatus";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faHeartCirclePlus, faMars, faVenus} from "@fortawesome/free-solid-svg-icons";
import {getSession, useSession, update} from "next-auth/react";
import {useEffect, useState} from "react";


const CatCard = ({cat, setShowCatModal, handleClose, getUserByApplicationId}) => {
    const session = useSession();
    const user = session.data?.user;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        displayFavCats();
    },[session]);

    useEffect(() => {
        setIsFavorite(user?.favorites?.some((favCat) => favCat._id === cat._id || favCat === cat._id) || false);
    }, [user, cat]);


    const displayFavCats = () => {

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

        } else {
            // Ajouter le chat aux favoris
            patchUser.favorites = [...patchUser.favorites, cat];
        }


        const response = await fetch("/api/user", {
            method: "PATCH",
            body: JSON.stringify(patchUser),
        });
        const data = await response.json();

        // Réinitialiser la session avec la version mise à jour
        await session.update({...session.data, user: data});
        setIsFavorite(!isFavorite);

    };

    return (
        <div className="card">
            <div className="card-top"
                 onClick={() => setShowCatModal(cat)}>
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
                <p>{catAge(cat)}</p>
            </div>
            <div className="status">
                <p>
                    {user?.role === "admin" && (
                        <p>{catStatus(cat)}</p>
                    )
                    }
                </p>
            </div>
            <div className="description"
                 onClick={() => setShowCatModal(cat)}>
                <p>{cat.description}</p>
            </div>

            {/*    Si le chat est adopté par le user*/}
            {cat.applications?.map((app) => app._id === session?.data?.user?.application?._id && (
                <div className="chadopt-group-btn" key={app._id}>
                    <div className="button" id="button">😻</div>
                    <p className="chadopt-btn">Tu m&apos;as déjà chadopté !</p>
                </div>
            ))}
            {!session?.data?.user?.application?._id && (
                <div className="chadopt-group-btn">
                    <p className="chadopt-btn">Chadopt&apos; Moi !</p>
                    <div className="button" id="button">😸</div>
                </div>
            )}
        </div>
    )
}

export default CatCard