"use client";
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
    const fetchAllCats = async () => {
        const response = await fetch("/api/cat");
        const data = await response.json();
        setAllCats(data);
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

    useEffect(() => {
        fetchAllCats();
    }, []);

    return (
        <div>
            <h1>Feed</h1>
            <CatCardList data={allCats}/>
            <Button onClick={insertCat}>Insert Cat</Button>
        </div>
    )
}

export default Feed