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
  const [isEditing, setIsEditing] = useState(false);
  const [isPractice, setisPractice] = useState(false);
  const [practiceDirection, setPracticeDirection] = useState<'forward' | 'reverse'>('forward');
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [rememberedWords, setRememberedWords] = useState<WordPair[]>([]);
  const [notRememberedWords, setNotRememberedWords] = useState<WordPair[]>([]);
  const [mixWords, setMixWords] = useState<WordPair[]>([])
  const navigate = useNavigate();

    useEffect(() => {
    if (isPractice || isPracticing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Очистка при размонтировании
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPractice, isPracticing]);

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
        name: 'Основной словарь',
        description: 'Ваш словарь по умолчанию',
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

  const handleDeleteWord = (wordToDelete: WordPair) => {
    if (!dictionary) return;
    
    // Создаем новый массив без удаленного слова
    const updatedWords = dictionary.words.filter(
      word => word.original !== wordToDelete.original || 
             word.translation !== wordToDelete.translation
    );
    
    // Обновляем текущий словарь
    const updatedDictionary = { ...dictionary, words: updatedWords };
    setDictionary(updatedDictionary);
    
    // Обновляем список всех словарей
    const updatedDictionaries = dictionaries.map(d => 
      d.id === dictionary.id ? updatedDictionary : d
    );
    setDictionaries(updatedDictionaries);
    
    // Сохраняем в localStorage
    localStorage.setItem('dictionaries', JSON.stringify(updatedDictionaries));
  };

  if (!dictionary) {
    return <div className={styles.loading}>Загрузка словаря...</div>;
  }

  const handleDeleteDictionary = () => {
    const updatedDictionaries = dictionaries.filter(d => d.id !== dictionary.id);
    setDictionaries(updatedDictionaries);
    localStorage.setItem('dictionaries', JSON.stringify(updatedDictionaries));
    navigate(-1);
};

const handleStartPractice = () => {
  setisPractice(false);
  
  const words = [...dictionary.words].sort(() => Math.random() - 0.5);
  setMixWords(words);
  setCurrentWordIndex(0);
  setShowTranslation(false);
  setRememberedWords([]);
  setNotRememberedWords([]);
  setIsPracticing(true);
};

const handleRemember = (remembered: boolean) => {
  const currentWord = mixWords[currentWordIndex];
  
  if (remembered) {
    setRememberedWords([...rememberedWords, currentWord]);
  } else {
    setNotRememberedWords([...notRememberedWords, currentWord]);
  }
  
  // Переходим к следующему слову или завершаем
  if (currentWordIndex < mixWords.length - 1) {
    setCurrentWordIndex(currentWordIndex + 1);
    setShowTranslation(false);
  } else {
    // Завершаем практику
    setIsPracticing(false);
  }
};

const handleCardClick = () => {
  setShowTranslation(!showTranslation);
};

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
          <button 
            className={`${styles.actionButton} ${isEditing ? styles.doneButton : styles.editButton}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <span className="material-icons">{isEditing ? 'done' : 'edit'}</span>
            {isEditing ? 'Завершить' : 'Редактировать'}
          </button>
            {isEditing && (
    <button 
      className={`${styles.actionButton} ${styles.deleteDictionaryButton}`}
      onClick={handleDeleteDictionary}
    >
      <span className="material-icons">delete_forever</span>
      Удалить словарь
    </button>
  )}
          {!isEditing&&<button onClick={()=>setisPractice(true)} className={`${styles.actionButton} ${styles.practiceButton}`}>
            <span className="material-icons">school</span>
            Практика
          </button>}
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
          {isEditing && (
            <div className={styles.editHint}>
              <span className="material-icons">info</span>
              Нажмите на слово для удаления
            </div>
          )}
        </div>
      </div>

      <div className={styles.wordsList}>
        {filteredWords.length > 0 ? (
          filteredWords.map((word, index) => (
            <div 
              key={`${word.original}-${index}`} 
              className={`${styles.wordCard} ${isEditing ? styles.editableCard : ''}`}
              onClick={() => isEditing && handleDeleteWord(word)}
            >
              {isEditing && (
                <div className={styles.deleteOverlay}>
                  <span className="material-icons">delete_forever</span>
                </div>
              )}
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
      {/* Модальное окно для практики */}
{isPractice && (
  <div className={styles.practiceModalOverlay} onClick={() => setisPractice(false)}>
    <div className={styles.practiceModal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h2>Режим практики: {dictionary.name}</h2>
        <button 
          className={styles.closeButton}
          onClick={() => setisPractice(false)}
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      
      <div className={styles.modalContent}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <span className="material-icons">help_outline</span>
          </div>
          <div className={styles.infoText}>
            <h3>Как работает практика?</h3>
            <p>Вам будет показываться слово из словаря. Попробуйте вспомнить его перевод.</p>
            <p>Чтобы проверить, правильно ли вы его вспомнили, нажмите на карточку - появится перевод.</p>
          </div>
        </div>
        
        <div className={styles.directionSelector}>
          <h3 className={styles.directionTitle}>
            <span className="material-icons">translate</span>
            Направление перевода:
          </h3>
          <div className={styles.toggleButtons}>
            <button 
              className={`${styles.toggleButton} ${practiceDirection=== 'forward'? styles.active : ''}`}
              onClick={() => setPracticeDirection('forward')}
            >
              {dictionary.from.toUpperCase()} → {dictionary.to.toUpperCase()}
            </button>
            <button 
              className={`${styles.toggleButton} ${practiceDirection=== 'reverse'? styles.active : ''}`}
              onClick={() => setPracticeDirection('reverse')}
            >
              {dictionary.to.toUpperCase()} → {dictionary.from.toUpperCase()}
            </button>
          </div>
        </div>
        
        <div className={styles.startPractice}>
          <button className={styles.startButton} onClick={handleStartPractice}>
            <span className="material-icons">play_arrow</span>
            Начать практику
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{isPracticing && (
  <div className={styles.practiceModeWork}>
    <div className={styles.practiceHeader}>
      <button 
        className={styles.practiceBackButton}
        onClick={() => setIsPracticing(false)}
      >
        <span className="material-icons">arrow_back</span>
        Выйти из практики
      </button>
      <div className={styles.progress}>
        {currentWordIndex + 1} / {mixWords.length}
      </div>
    </div>
    
    <div 
      className={styles.practiceCard}
      onClick={handleCardClick}
    >
      {showTranslation ? (
        practiceDirection === 'forward' 
          ? mixWords[currentWordIndex]?.translation 
          : mixWords[currentWordIndex]?.original
      ) : (
        practiceDirection === 'forward' 
          ? mixWords[currentWordIndex]?.original 
          : mixWords[currentWordIndex]?.translation
      )}
    </div>
    
    {showTranslation && (
      <div className={styles.rememberButtons}>
        <button 
          className={styles.rememberButton}
          onClick={() => handleRemember(true)}
        >
          <span className="material-icons">check</span>
          Помню
        </button>
        <button 
          className={styles.notRememberButton}
          onClick={() => handleRemember(false)}
        >
          <span className="material-icons">close</span>
          Не помню
        </button>
      </div>
    )}
    
    {!showTranslation && (
      <div className={styles.practiceHint}>
        <span className="material-icons">touch_app</span>
        Нажмите на слово, чтобы увидеть перевод
      </div>
    )}
  </div>
)}
    </div>
  );
}

export default SinglePage;