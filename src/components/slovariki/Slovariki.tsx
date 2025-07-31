import { useState } from "react";
import styles from "./Slovariki.module.css"
import { useNavigate } from "react-router-dom";

type WordPair = { original: string; translation: string };
type Dictionary = { id: number; name: string; description: string; words: WordPair[]; from: string; to: string; };

function Slovariki() {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([
    {
      id: 1,
      name: 'Основной словарь',
      description: 'Основные фразы для начала изучения языка',
      words: [
        { original: 'Привет', translation: 'Hello' },
        { original: 'Спасибо', translation: 'Thank you' },
        { original: 'Пожалуйста', translation: 'Please' },
        { original: 'Как дела?', translation: 'How are you?' },
        { original: 'Добро пожаловать', translation: 'Welcome' },
      ],
      from: 'ru',
      to: 'en'
    }
  ]);

  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/dictionaries/${id}`);
  };

  return (
    <div className={styles.dictionariesDiv}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои словари:</h1>
        <button className={styles.createButton}>
          <span className="material-icons">add</span>
          Новый словарь
        </button>
      </div>

      <div className={styles.dictionariesGrid}>
        {dictionaries.length > 0 ? (
          dictionaries.map(dict => (
            <div 
              key={dict.id} 
              className={styles.dictionaryItem}
              onClick={() => handleClick(dict.id)}
            >
              <h2 className={styles.dictionaryName}>
                <span className="material-icons">book</span>
                {dict.name}
              </h2>
              <p className={styles.dictionaryDescription}>{dict.description}</p>
              <div className={styles.dictionaryMeta}>
                <span>{dict.words.length} слов</span>
                <span>{dict.from.toUpperCase()} → {dict.to.toUpperCase()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyMessage}>
            <h3>У вас пока нет словарей</h3>
            <p>Начните изучение языка, создав свой первый словарь</p>
            <button className={styles.emptyButton}>
              <span className="material-icons">add</span>
              Создать словарь
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Slovariki;