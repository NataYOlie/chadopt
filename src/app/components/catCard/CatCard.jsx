"use client"
import "./catcard.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faVenus} from "@fortawesome/free-solid-svg-icons";

const CatCard = ({cat}) => {


    console.log(cat)
    console.log(cat.name)
    return (
        <div className="card">
            {/*https://cataas.com/cat/says/Hello?fontColor=white&fontSize=20&type=square*/}
            <img src={`https://cataas.com/cat/says/${cat.name}?fontSize=20&fontColor=white&type=square`} alt={cat.name} />
            <div className="container">
                <h3 className="card-title">{cat.name}</h3>
                {cat.sex === "male" ? (
                    <FontAwesomeIcon icon={faMars}/>
                ) : (  <FontAwesomeIcon icon={faVenus}/>)}
            </div>
            <div className="container">
                <p>
                    {cat.city}
                </p>
                <p>
                    {cat.adoptionStatus}
                </p>
            </div>
            <div className="description">
                <p>{cat.description}</p>
            </div>
        </div>
    )
}

export default CatCard