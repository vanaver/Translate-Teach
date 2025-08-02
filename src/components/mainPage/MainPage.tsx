// MainPage.tsx
import { useState, useEffect, useRef } from 'react';
import styles from './mainPage.module.css'

function MainPage() {
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
  type Language = { code: string; name: string };
  type Direction = { from: string, to: string };
  type HistoryItem = { 
    id: number; 
    input: string; 
    output: string; 
    direction: Direction 
  };
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputText, setOutputText] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [direction, setDirection] = useState<Direction>({ from: "ru", to: "en" });
  const [translationHistory, setTranslationHistory] = useState<HistoryItem[]>([]);
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [selectedDictionary, setSelectedDictionary] = useState<number | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const latestRequestId = useRef(0);

  useEffect(()=> {
    const savedDictionaries = localStorage.getItem('dictionaries');
    if (savedDictionaries) {
      setDictionaries(JSON.parse(savedDictionaries));
    } else {
      setDictionaries([{
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
    }])
    }
  },[])
  
  useEffect(() => {
    // Загрузка истории из localStorage
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      setTranslationHistory(JSON.parse(savedHistory));
    }

    // Загрузка языков
    const fetchLanguages = async () => {
      try {
        const response = await fetch('https://lingva.ml/api/v1/languages');
        if (!response.ok) throw new Error('Ошибка загрузки языков');
        const data = await response.json();
        setLanguages(data.languages);
      } catch (error) {
        console.error(error);
        setLanguages([
          { code: 'en', name: 'English' },
          { code: 'ru', name: 'Russian' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'it', name: 'Italian' },
        ]);
      }
    }
    fetchLanguages();
  }, []);

  // Сохранение истории в localStorage
  useEffect(() => {
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
  }, [translationHistory]);

  const swapLanguages = () => {
    setDirection(prev => ({ from: prev.to, to: prev.from }));
  };

  async function fetchTranslate(text: string) {
    try {
      const response = await fetch(
        `https://lingva.ml/api/v1/${direction.from}/${direction.to}/${encodeURIComponent(text)}`
      );
      if (!response.ok) throw new Error('Ошибка перевода');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (inputText.trim() === "") {
      setOutputText("");
      return;
    }
    
    latestRequestId.current += 1;
    const currentId = latestRequestId.current;
    
    const delay = setTimeout(async () => {
      setIsLoading(true);
      const result = await fetchTranslate(inputText);
      
      if (currentId === latestRequestId.current) {
        if (result?.translation) {
          setOutputText(result.translation);
               
           setTranslationHistory(prev => [
          {
            id: Date.now(),
            input: inputText,
            output: result.translation,
            direction: { ...direction }
          },
          ...prev.filter(item => item.input !== inputText) // Удаляем старые записи с таким же текстом
        ].slice(0, 15));
        } else {
          setOutputText("Ошибка, слишком много запросов в минуту, подождите 15 сек");
        }
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [inputText, direction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleDeleteClick = () => {
    setInputText('');
    setOutputText('');
  };

  const handleSaveClick = () => {
    if (inputText.trim() && outputText.trim()) {
      setShowSaveModal(true);
    }
  };

  const clearHistory = () => {
    setTranslationHistory([]);
  };

  function handleSaveModalClick() {
    if (selectedDictionary === null) return;

    const selectedDict = dictionaries.find(dict=> dict.id === selectedDictionary);
    if (!selectedDict) {console.log("нету словаря с таким айди"); return};

    const currentDirection = `${direction.from}-${direction.to}`;
    const dictDirection = `${selectedDict.from}-${selectedDict.to}`;
    const reversedDirection = `${direction.to}-${direction.from}`;

    if(currentDirection === dictDirection) {
      const isDuplicate = selectedDict.words.some(
        word => word.original === inputText && word.translation === outputText
      );
      if(!isDuplicate) {
        const updateDictionaries = dictionaries.map(dict => {
          if(dict.id === selectedDictionary){
            return {
              ...dict,
              words: [...dict.words, {original:inputText, translation: outputText}]
            }
          } return dict;
        });
        setDictionaries(updateDictionaries);
        localStorage.setItem('dictionaries', JSON.stringify(updateDictionaries));
        alert("Фраза успешно добавлена в словарь")
      } else alert('Эта фраза уже есть в словаре')
    }
     else if (reversedDirection === dictDirection) {
    // Проверяем, нет ли уже такой пары в словаре (в обратном порядке)
    const isDuplicate = selectedDict.words.some(
      word => word.original === outputText && word.translation === inputText
    );
    
    if (!isDuplicate) {
      // Обновляем словари (меняем местами слова)
      const updatedDictionaries = dictionaries.map(dict => {
        if (dict.id === selectedDictionary) {
          return {
            ...dict,
            words: [...dict.words, { original: outputText, translation: inputText }]
          };
        }
        return dict;
      });
      
      setDictionaries(updatedDictionaries);
      localStorage.setItem('dictionaries', JSON.stringify(updatedDictionaries));
      alert("Фраза успешно добавлена в словарь (с заменой направления)!");
    } else {
      alert("Эта фраза (в обратном порядке) уже есть в словаре!");
    }
  }
  // Если направления не совпадают
  else {
    const fromLang = languages.find(l => l.code === selectedDict.from)?.name || selectedDict.from;
    const toLang = languages.find(l => l.code === selectedDict.to)?.name || selectedDict.to;
    
    alert(`Направление перевода не совпадает с направлением словаря!\n\n` +
          `Текущий перевод: ${languages.find(l => l.code === direction.from)?.name} → ${languages.find(l => l.code === direction.to)?.name}\n` +
          `Направление словаря: ${fromLang} → ${toLang}`);
    return;
  }
  
  // Закрываем модальное окно
  setShowSaveModal(false);
  setSelectedDictionary(null);
  }

  return (
    <div>
      <div className={styles.translator}>
        <div className={styles.translatorHeader}>
          <h1>Умный Переводчик</h1>
          <p>Переводите слова и фразы между 100+ языками в реальном времени</p>
        </div>
        
        <div className={styles.plusButtons}>
          <div className={styles.translatorPart}>
            <div className={styles.languageSelector}>
              <select 
                className={styles.language} 
                value={direction.from} 
                onChange={(e) => setDirection(prev => ({...prev, from: e.target.value}))}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              
              <button 
                className={styles.swapButton}
                onClick={swapLanguages}
                title="Поменять языки местами"
              >
                <span className="material-icons">swap_horiz</span>
              </button>
              
              <select 
                className={styles.language} 
                value={direction.to} 
                onChange={(e) => setDirection(prev => ({...prev, to: e.target.value}))}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            
            <textarea 
              className={`${styles.areas} ${styles.inputArea}`}
              placeholder='Введите текст для перевода...'
              value={inputText}
              onChange={handleInputChange}
            />
            
            <div className={styles.buttonsDiv}>
              <button 
                className={`${styles.buttons} ${styles.delete}`}
                onClick={handleDeleteClick}
                disabled={!inputText}
              >
                <span className="material-icons">delete</span>
                Очистить
              </button>
              <button 
                className={`${styles.buttons} ${styles.save}`}
                onClick={handleSaveClick}
                disabled={!outputText.trim() || outputText.includes('Ошибка, слишком много запросов в минуту, подождите 15 сек')}
              >
                <span className="material-icons">bookmark</span>
                Сохранить
              </button>
            </div>
          </div>
          
          <div className={styles.translatorPart}>
            <textarea 
              className={`${styles.areas} ${styles.outputArea}`}
              readOnly
              placeholder={isLoading ? 'Перевод...' : 'Результат перевода'}
              value={isLoading ? 'Перевод' + (outputText ? ' (обновление)...' : '...') : outputText}
            />
          </div>
        </div>
      </div>

      {translationHistory.length > 0 && (
        <div className={styles.translationHistory}>
          <div className={styles.historyHeader}>
            <h2 className={styles.historyTitle}>
              <span className="material-icons">history</span>
              История переводов
            </h2>
            <button 
              className={styles.clearHistory}
              onClick={clearHistory}
            >
              <span className="material-icons">delete_sweep</span>
              Очистить
            </button>
          </div>
          
          <div className={styles.historyList}>
            {translationHistory.map(item => (
              <div key={item.id} className={styles.historyItem} onClick={function(){
                setInputText(item.input)
              }}>
                <div className={styles.historyText}>
                  <div className={styles.historyFix}><strong>{item.input}</strong></div>
                  <div className={styles.historyFix}>{item.output}</div>
                </div>
                <div className={styles.historyLanguages}>
                  {languages.find(l => l.code === item.direction.from)?.name} → 
                  {languages.find(l => l.code === item.direction.to)?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
            {/* Модальное окно для сохранения в словарь */}
      {showSaveModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.saveModal}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Сохранить перевод</h2>
              <h3>{inputText}  -  {outputText}</h3>
              <p className={styles.modalSubtitle}>Выберите словарь для сохранения:</p>
              
              <div className={styles.dictionariesList}>
                {dictionaries.map(dict => (
                  <div 
                    key={dict.id}
                    className={`${styles.dictionaryCard} ${
                      selectedDictionary === dict.id ? styles.selectedCard : ''
                    }`}
                    onClick={() => setSelectedDictionary(dict.id)}
                  >
                    <h3>{dict.name}</h3>
                    <p>{dict.description}</p>
                    <div className={styles.languageBadge}>
                      {languages.find(l => l.code === dict.from)?.name} → 
                      {languages.find(l => l.code === dict.to)?.name}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.modalButtons}>
                <button 
                  className={`${styles.modalButton} ${styles.cancelButton}`}
                  onClick={() =>{ setShowSaveModal(false); setSelectedDictionary(null)}}
                >
                  Отмена
                </button>
                <button 
                  className={`${styles.modalButton} ${styles.saveButton}`}
                  onClick={handleSaveModalClick}
                  disabled={!selectedDictionary}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainPage;