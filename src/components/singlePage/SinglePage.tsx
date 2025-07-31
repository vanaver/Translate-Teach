import { useParams } from "react-router-dom";
import styles from './SinglePage.module.css'
import { useState } from "react";
useState

function SinglePage() {
  const { slovarik } = useParams();
  
  // В реальном приложении здесь будет запрос к API/БД
  const dictionary = {
    id: 1,
    name: 'Основной словарь',
    description: 'Основные фразы для начала изучения языка',
    words: [
      { id: 1, original: 'Привет', translation: 'Hello' },
      { id: 2, original: 'Спасибо', translation: 'Thank you' },
      { id: 3, original: 'Пожалуйста', translation: 'Please' },
      { id: 4, original: 'Как дела?', translation: 'How are you?' },
      { id: 5, original: 'Добро пожаловать', translation: 'Welcome' },
      { id: 6, original: 'Да', translation: 'Yes' },
      { id: 7, original: 'Нет', translation: 'No' },
      { id: 8, original: 'Извините', translation: 'Excuse me' },
    ],
    from: 'ru',
    to: 'en',
    wordCount: 8
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = dictionary.words.filter(word => 
    word.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.dictionaryName}>{dictionary.name}</h1>
          <p className={styles.dictionaryDescription}>{dictionary.description}</p>
          <div className={styles.metaInfo}>
            <span><span className="material-icons">library_books</span> {dictionary.wordCount} слов</span>
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
          filteredWords.map(word => (
            <div key={word.id} className={styles.wordCard}>
              <div className={styles.original}>{word.original}</div>
              <div className={styles.translation}>{word.translation}</div>
            </div>
          ))
        ) : (
          <div className={styles.emptyWords}>
            <span className="material-icons">search_off</span>
            <h3>Совпадений не найдено</h3>
            <p>Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePage;