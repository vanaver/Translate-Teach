// MainPage.tsx
import { useState, useEffect, useRef } from 'react';
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
    const [inputText, setInptutText] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dots, setDots] = useState<string>('');
    const [outputText, setOutputText] = useState<string>('')
    const [languages, setLanguages] = useState<Language[]>([]);
    const [direction, setDirection] = useState<Direction>({
        from: "ru",
        to: "en",
    })
    const latestRequestId = useRef(0);
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch('https://lingva.ml/api/v1/languages');
                if(!response.ok){throw new Error('Ошбка загрузки языков')};
                const data = await response.json();
                setLanguages(data.languages);
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

    function handleLanguageChangeFrom (el: any) {
        setDirection(prev => ({...prev, from: el.target.value}));
    };
    function handleLanguageChangeTo (el: any) {
        setDirection(prev => ({...prev, to: el.target.value}))
    };

    async function fetchTranslate (text: string) {
        try{
            const response = await fetch(`https://lingva.ml/api/v1/${direction.from}/${direction.to}/${text}`);
            if(!response.ok) {throw new Error('респонс не окей')}
            const data = await response.json();
            console.log(data)
            return data
        } catch (error){
            console.log(error)
        }

    };

    // КЛЮЧЕВОЕ
    useEffect(() => {
  if (inputText.trim() === "") {
    setOutputText("");
    return;
  }
  latestRequestId.current+=1;
  const currentId = latestRequestId.current;

  const delay = setTimeout(async () => {
    setIsLoading(true)
    const result = await fetchTranslate(inputText);
      if (currentId === latestRequestId.current) {
    if (result && result.translation) {
      setOutputText(result.translation);
    } else {
      setOutputText("Ошибка перевода, скорее всего слишком много обращений к апи за определенный промежуток времени, подождите 15сек+- да и вообще оно бесплатное и работает плохо");
    }}
    setIsLoading(false)
  }, 500); // 1 секунда задержки

  return () => clearTimeout(delay); // отменить прошлую задержку, если ввод продолжается
}, [inputText, direction]);

    const handleInputChange = async ({target}: any) => {
        const newText = target.value;
        setInptutText(newText)
    }

    // тут анимация точек 
useEffect(() => {
  if (!isLoading) {
    setDots('');
    return;
  }

  let i = 0;
  const interval = setInterval(() => {
    if (i === 0) setDots('.');
    else if (i === 1) setDots('..');
    else setDots('...');

    i = (i + 1) % 3; // циклим i от 0 до 2
  }, 240);

  return () => clearInterval(interval); // очищаем интервал при изменении isLoading или размонтировании
}, [isLoading]);


    function handleDeleteClick() {
        setInptutText('')
    };
    
    function handleSaveClick() {
        
    }

    return(
        // ниже див всего переводчика в целом
        <main className={styles.translator}> 
            {/* ниже див одной секции с выбором языка и textarea */}
            <div className={styles.plusButtons}>
                <div className={styles.translatorPart}> 
                    <select className={styles.language} value={direction.from} onChange={(handleLanguageChangeFrom)} >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                    <textarea className={`${styles.areas} ${styles.inputArea}`} name="area1" id="area1" placeholder='Введите слово для перевода'
                    value={inputText}
                    onChange={handleInputChange}></textarea>
                </div>
                            {/* кнопки */}
                <div className={styles.buttonsDiv}>
                    <button className={`${styles.buttons} ${styles.delete}`} onClick={handleDeleteClick}>стереть</button>
                    <button className={`${styles.buttons} ${styles.save}`}>сохранить в..</button>
                </div>
            </div>
            {/* секция вторая часть переводчика */}
            <div className={styles.translatorPart}>
                <select className={styles.language} value={direction.to} onChange={handleLanguageChangeTo}>
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
                <textarea 
                className={`${styles.areas} ${styles.outputArea}`} 
                readOnly 
                disabled={false}
                name="area2" 
                id="area2" 
                placeholder='перевод'
                value={isLoading? `Переводим${dots}` : outputText}
                ></textarea>
            </div>
        </main>
    )
};

export default MainPage;

