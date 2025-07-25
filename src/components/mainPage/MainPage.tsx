import { useState, useEffect } from 'react';
import styles from './mainPage.module.css'


function MainPage(){
    type Language = {
        code: string;
        name: string;
};
    type Direction = {
        from: string,
        to: string,
    }
    const [languages, setLanguages] = useState<Language[]>([]);
    const [direction, setDirection] = useState<Direction>({
        from: "ru",
        to: "en",
    })
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch('https://libretranslate.com/languages');
                if(!response.ok){throw new Error('Ошбка загрузки языков')};
                const data: Language[] = await response.json();
                setLanguages(data);
            } catch (error) {
                console.log(error)
                setLanguages([
          { code: 'en', name: 'English' },
          { code: 'ru', name: 'Russian' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
        ]);
            }
        }
        fetchLanguages()
    }, []);

    useEffect(() => {
  console.log('Current direction:', direction);
}, [direction]);

    function handleLanguageChangeFrom (el: any) {
        setDirection(prev => ({...prev, from: el.target.value}));
    };
    function handleLanguageChangeTo (el: any) {
        setDirection(prev => ({...prev, to: el.target.value}))
    };

    return(
        // ниже див всего переводчика в целом
        <main className={styles.translator}> 
            {/* ниже див одной секции с выбором языка и textarea */}
            <div className={styles.translatorPart}> 
                <select className={styles.language} value={direction.from} onChange={(handleLanguageChangeFrom)} >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
                <textarea    className={`${styles.areas} ${styles.inputArea}`} name="area1" id="area1" placeholder='Введите слово для перевода'></textarea>
            </div>
            {/* секция вторая часть переводчика */}
            <div className={styles.translatorPart}>
                <select className={styles.language} value={direction.to} onChange={handleLanguageChangeTo}>
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
                <textarea className={`${styles.areas} ${styles.outputArea}`} readOnly disabled={false} name="area2" id="area2" placeholder='перевод'></textarea>
            </div>
        </main>
    )
};

export default MainPage;

