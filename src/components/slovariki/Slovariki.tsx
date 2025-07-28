import { useState } from "react";
import styles from "./Slovariki.module.css"
import { useNavigate } from "react-router-dom";


// slovariki.tsx
type WordPair = {
  original: string;     // оригинальный текст
  translation: string;  // перевод
};

type Dictionary = {
    id: number;
    name: string;
    words: WordPair[];
}



function Slovariki() {

    const [dictionaries, setDictionaries] = useState<Dictionary[]>([{
    id: 0,
    name: 'Default Dictionary',
    words: []
}])

const navigate = useNavigate();

function handleClick (name: string) {
     const encodedName = encodeURIComponent(name);
     navigate(`/dictionaries/${encodedName}`)
};

    return(
        <div className={styles.dictionariesDiv}>
            {dictionaries.map((el)=> (
                <div key={el.id} className={styles.dictionaryItem} onClick={()=>handleClick(el.name)}>
                    <h1>{el.name}</h1>
                </div>
            ))}
        </div>
    )
};

export default Slovariki;