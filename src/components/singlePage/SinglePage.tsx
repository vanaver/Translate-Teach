import { useParams, useNavigate } from "react-router-dom";
import styles from './SinglePage.module.css'
import { useState, useEffect } from "react";

type WordPair = { 
  original: string; 
  translation: string; 
};

type Dictionary = { 
  id: number; 
  name: string; 
  description: string; 
  words: WordPair[]; 
  from: string; 
  to: string; 
};

function SinglePage() {
  const { slovarik } = useParams();
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [filteredWords, setFilteredWords] = useState<WordPair[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDictionaries = localStorage.getItem('dictionaries');
    if (savedDictionaries) {
      const parsed = JSON.parse(savedDictionaries);
      setDictionaries(parsed);
      
      // Находим словарь по имени из параметров
      const decodedName = decodeURIComponent(slovarik || '');
      const foundDict = parsed.find((d: Dictionary) => d.name === decodedName);
      setDictionary(foundDict || null);
    } else {
      // Если в localStorage нет, устанавливаем начальный словарь
      const initialDict = {
        id: 1,
        name: 'Осной словарь',
        description: 'Ваш словарь котоырй есть по умолчанию',
        words: [
          { original: 'Привет', translation: 'Hello' },
          { original: 'Спасибо', translation: 'Thank you' },
          { original: 'Пожалуйста', translation: 'Please' },
          { original: 'Как дела?', translation: 'How are you?' },
          { original: 'Добро пожаловать', translation: 'Welcome' },
        ],
        from: 'ru',
        to: 'en'
      };
      
      setDictionaries([initialDict]);
      setDictionary(initialDict);
      localStorage.setItem('dictionaries', JSON.stringify([initialDict]));
    }
  }, [slovarik]);

  // Фильтрация слов при изменении поиска или словаря
  useEffect(() => {
    if (!dictionary) return;
    
    const filtered = dictionary.words.filter(word => 
      word.original.toLowerCase().includes(searchTerm.toLowerCase()) || 
      word.translation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredWords(filtered);
  }, [searchTerm, dictionary]);

  if (!dictionary) {
    return <div className={styles.loading}>Загрузка словаря...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleRow}>
            <button 
              className={styles.backButton}
              onClick={() => navigate(-1)}
              title="Вернуться назад"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <h1 className={styles.dictionaryName}>{dictionary.name}</h1>
          </div>
          
          <p className={styles.dictionaryDescription}>{dictionary.description}</p>
          <div className={styles.metaInfo}>
            <span><span className="material-icons">library_books</span> {dictionary.words.length} слов</span>
            <span><span className="material-icons">translate</span> {dictionary.from.toUpperCase()} → {dictionary.to.toUpperCase()}</span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={`${styles.actionButton} ${styles.editButton}`}>
            <span className="material-icons">edit</span>
            Редактировать
          </button>
          <button className={`${styles.actionButton} ${styles.practiceButton}`}>
            <span className="material-icons">school</span>
            Практика
          </button>
        </div>
      </div>

      <div className={styles.searchBox}>
        <span className={`${styles.searchIcon} material-icons`}>search</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск по словарю..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.wordsHeader}>
        <h2 className={styles.wordsTitle}>
          <span className="material-icons">list</span>
          Слова и фразы
        </h2>
        <div className={styles.wordsCount}>
          Показано: {filteredWords.length} из {dictionary.words.length}
        </div>
      </div>

      <div className={styles.wordsList}>
        {filteredWords.length > 0 ? (
          filteredWords.map((word, index) => (
            <div key={`${word.original}-${index}`} className={styles.wordCard}>
              <div className={styles.original}>{word.original}</div>
              <div className={styles.translation}>{word.translation}</div>
            </div>
          ))
        ) : (
          <div className={styles.emptyWords}>
            <span className="material-icons">search_off</span>
            <h3>Совпадений не найдено или слов нет</h3>
            <p>Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SinglePage;