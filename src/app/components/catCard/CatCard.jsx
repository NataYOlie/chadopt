"use client"

const CatCard = ({cat}) => {
    console.log(cat)
    console.log(cat.name)
    return (
        <div className="card">
            <img src={`https://cataas.com/cat/says/${cat.name}?fontSize=50&fontColor=white`} alt={cat.name} />
            <div className="card-body">
                <h5 className="card-title">{cat.name}</h5>
                <p className="card-text">{cat.description}</p>
            </div>
        </div>
    )
}

export default CatCard