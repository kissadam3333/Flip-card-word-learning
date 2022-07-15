import styles from '../../styles/CreateCollection.module.css';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

let collectionName;
/* const tempStorage = {}; */

export default function CreateCollection() {
    const router = useRouter();
    const [isCreationPage, setIsCreationPage] = useState(true/* false */);
    const [cardCounter, setcardCounter] = useState(1);
    const [language1, setLanguage1] = useState('');
    const [language2, setLanguage2] = useState('');
    const [tempStorage, setTempStorage] = useState({});

    const handleNextButton = (event) => {
        event.preventDefault();
        collectionName = event.target[0].value;
        setIsCreationPage(false);
    }

    const handleRightClick = () => {
        if (cardCounter < 50) {
            setcardCounter(++cardCounter);
            setLanguage1('');
            setLanguage2('');

            if (tempStorage[cardCounter]) {
                setLanguage1(tempStorage[cardCounter]['hun']);
                setLanguage2(tempStorage[cardCounter]['eng']);
            }
        }
    }

    const handleLeftClick = () => {
        if (cardCounter > 1) {
            setcardCounter(--cardCounter);

            setLanguage1(tempStorage[cardCounter]['hun']);
            setLanguage2(tempStorage[cardCounter]['eng']);
        }
    }
    const handleOnchangeText = (event, language) => {
        if (!tempStorage[cardCounter])
            setTempStorage({ ...tempStorage, [cardCounter]: { 'hun': null, 'eng': null } })
        language === 'hun' ? setTempStorage((currState) => ({ ...currState, [cardCounter]: { 'hun': event.target.value, 'eng': currState[cardCounter]['eng'] } })) : setTempStorage((currState) => ({ ...currState, [cardCounter]: { 'hun': currState[cardCounter]['hun'], 'eng': event.target.value } }));
        language === 'hun' ? setLanguage1(event.target.value) : setLanguage2(event.target.value);
    }


    const handleFinish = () => {
        const numberOfCards = Object.keys(tempStorage).length;
        const finalObj = { 'timeStamp': Date.now(), numberOfCards, 'name': collectionName, 'data': tempStorage }
        fetch('http://localhost:3000/api/tempDb', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalObj),
        })
            .then(() => router.push('/'))
            .catch(err => console.error(err));
    }

    const render = () => {
        if (isCreationPage)
            return <div className={styles.container}>
                <p>Name Your Collection</p>
                <form onSubmit={handleNextButton}>
                    <input type="text" name="name" maxLength="30" /><br />
                    <input type="submit" value="Next" />
                </form>
            </div>
        else
            return <div className={styles.creationContainerMain}>
                {cardCounter < 2 && <div className={styles.topTxt}><h2>Please type your words </h2> <h3>(min 15)</h3></div>}

                <div className={styles.imageWrapperLeft}>
                    {cardCounter > 1 && (<Image src="/arrow_left.png" alt="arrow_left" height="148" width="84" onClick={handleLeftClick} />)}
                </div>
                <div className={styles.imageWrapperRight}>
                    {cardCounter < 50 && <Image src="/arrow_right.png" alt="arrow_right" height="148" width="84" onClick={handleRightClick} />}
                </div>

                <div className={styles.creationContainer}>
                    <textarea name="comment" maxLength="110" placeholder="Type your Hungarian word or short sentence here..." value={language1} onChange={(e) => handleOnchangeText(e, 'hun')}></textarea>
                    <hr size="8" />
                    <p>HUN</p>
                    <hr size="8" />
                    <p>ENG</p>
                    <hr size="8" />
                    <textarea name="comment" maxLength="110" placeholder="Type your English word or short sentence here..." value={language2} onChange={(e) => handleOnchangeText(e, 'eng')} ></textarea>
                </div>
                <p className={styles.counter}>{cardCounter} / 50</p>
                <br />
                {cardCounter >= 1/* 15 */ && <button onClick={handleFinish}>Finish</button >}
            </div>
    }

    return (render())
}
