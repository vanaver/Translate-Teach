import { useState, useEffect } from "react";
import styles from "./Slovariki.module.css"
import { useNavigate } from "react-router-dom";

type WordPair = { original: string; translation: string };
type Dictionary = { id: number; name: string; description: string; words: WordPair[]; from: string; to: string; };
type Language = { code: string; name: string };

function Slovariki() {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [languages, setLanguages] = useState<Language[]>([]);
   const [newDictionary, setNewDictionary] = useState({
    name: '',
    description: '',
    from: 'ru',
    to: 'en'
  });

  const navigate = useNavigate();

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
    };
    fetchLanguages();

    },[])

  useEffect(() => {
    localStorage.setItem('dictionaries', JSON.stringify(dictionaries));
  }, [dictionaries]);

  const handleClick = (name: string) => {
    navigate(`/dictionaries/${name}`);
  };

  function makeNewDictionary () {
     if (!newDictionary.name.trim()) {
      alert("Пожалуйста, введите название словаря");
      return;
    }
    
    const newDict: Dictionary = {
      id: Date.now(),
      name: newDictionary.name,
      description: newDictionary.description,
      words: [],
      from: newDictionary.from,
      to: newDictionary.to
    };
    
    setDictionaries([...dictionaries, newDict]);
    setNewDictionary({
      name: '',
      description: '',
      from: 'ru',
      to: 'en'
    });
    setOpenModal(false);
  }

  const swapLanguages = () => {
    setNewDictionary(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };


  return (
    <div className={styles.dictionariesDiv}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои словари:</h1>
        <button className={styles.createButton}  onClick={() => setOpenModal(true)}>
          <span className="material-icons" >add</span>
          Новый словарь
        </button>
      </div>

      <div className={styles.dictionariesGrid}>
        {dictionaries.length > 0 ? (
          dictionaries.map(dict => (
            <div 
              key={dict.id} 
              className={styles.dictionaryItem}
              onClick={() => handleClick(dict.name)}
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
       {/* Модальное окно создания словаря */}
      {openModal && (
        <div className={styles.modalOverlay} onClick={() => setOpenModal(false)}>
          <div className={styles.createModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Создать новый словарь</h2>
              
              <div className={styles.formGroup}>
                <label>Название словаря</label>
                <input
                  type="text"
                  value={newDictionary.name}
                  onChange={(e) => setNewDictionary({...newDictionary, name: e.target.value})}
                  placeholder="Введите название"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Описание</label>
                <textarea
                  value={newDictionary.description}
                  onChange={(e) => setNewDictionary({...newDictionary, description: e.target.value})}
                  placeholder="Введите описание словаря"
                  rows={3}
                />
              </div>
              
              <div className={styles.languageSelector}>
                <div className={styles.formGroup}>
                  <label>Перевод с</label>
                  <select
                    value={newDictionary.from}
                    onChange={(e) => setNewDictionary({...newDictionary, from: e.target.value})}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  className={styles.swapButton}
                  onClick={swapLanguages}
                  title="Поменять языки местами"
                >
                  <span className="material-icons">swap_horiz</span>
                </button>
                
                <div className={styles.formGroup}>
                  <label>Перевод на</label>
                  <select
                    value={newDictionary.to}
                    onChange={(e) => setNewDictionary({...newDictionary, to: e.target.value})}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className={styles.modalButtons}>
                <button 
                  className={`${styles.modalButton} ${styles.cancelButton}`}
                  onClick={() => {setOpenModal(false); setNewDictionary({
    name: '',
    description: '',
    from: 'ru',
    to: 'en'
  })}}
                >
                  Отмена
                </button>
                <button 
                  className={`${styles.modalButton} ${styles.saveButton}`}
                  onClick={makeNewDictionary}
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Slovariki;