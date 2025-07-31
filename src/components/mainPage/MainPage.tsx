// MainPage.tsx
import { useState, useEffect, useRef } from 'react';
import styles from './mainPage.module.css'

function MainPage() {
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
  
  const latestRequestId = useRef(0);
  
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
          
          // Добавляем в историю
          const newHistoryItem = {
            id: Date.now(),
            input: inputText,
            output: result.translation,
            direction: { ...direction }
          };
          
          setTranslationHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
        } else {
          setOutputText("Ошибка перевода. Пожалуйста, попробуйте позже.");
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
      alert(`Фраза сохранена: ${inputText} → ${outputText}`);
      // Здесь будет логика сохранения в словарь
    }
  };

  const clearHistory = () => {
    setTranslationHistory([]);
  };

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
                disabled={!outputText.trim()}
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
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyText}>
                  <div><strong>{item.input}</strong></div>
                  <div>{item.output}</div>
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
    </div>
  )
}

export default MainPage;