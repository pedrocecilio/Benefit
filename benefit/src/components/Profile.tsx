import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const {level} = useContext(ChallengesContext);
    
    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/pedrocecilio.png" alt="Foto do Rosto do Pedro" />
            <div>
                <strong>Pedro Victor Cecilio</strong>
                <p>
                    <img src="icons/level.svg" alt="icone de level"/>
                    Level {level} </p>
            </div>
        </div>
    )
}