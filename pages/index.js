import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [collectionArray, setCollectionArray] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/tempDb')
      .then(res => res.json())
      .then(data => setCollectionArray(data))
      .catch((err) => console.error('Error:', err));
  }, []);


  const renderCard = (element) => {
    return (
      <div key={element.name} className={styles.collectionContainer}>
        <h2>{element.name}</h2>
        <hr />
        <p>Cards: {element.numberOfCards}</p>
        <button>Practice</button>
        <img className={styles.trashImg} src="./trash.png" alt="trash" onClick={() => handleDelete(element.timeStamp)} />
        <img className={styles.editImg} src="./edit.png" alt="edit" />
      </div>
    )
  }

  const handleAddNewCollection = () => {
    router.push('/createCollection')
  }
  const handleDelete = (timeStamp) => {//local copy
    setCollectionArray(currentArray => currentArray.filter(e => e.timeStamp !== timeStamp));
    fetch('http://localhost:3000/api/tempDb', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeStamp }),
    }).then(() => {
    }).catch(err => {
      console.error(err);
      router.push('/');
    })
  }

  return (
    <div className={styles.container}>
      {collectionArray.map(element => renderCard(element))}
      {collectionArray.length < 8 && <div onClick={handleAddNewCollection} className={styles.collectionContainerPlaceHolder}>
        <img src="/plus.png" alt="arrow_left" />
      </div>}
    </div>
  )
}
