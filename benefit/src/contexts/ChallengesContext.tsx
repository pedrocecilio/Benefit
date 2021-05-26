import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContexData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    experienceTONextLevel: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;

}

interface ChallengesProvidersProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}


export const ChallengesContext = createContext({} as ChallengesContexData);

export function ChallengesProvider({
    children,
    ...rest
}: ChallengesProvidersProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrenteExpirience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceTONextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notificantion.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio!!!', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }
    //Vai gerar Desafios aleatórios

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge(challenge) {
        if (!activeChallenge) {
            
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceTONextLevel) {
            finalExperience = finalExperience - experienceTONextLevel;
            levelUp();
        }

        setCurrenteExpirience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider value={{
            level,
            currentExperience,
            experienceTONextLevel,
            challengesCompleted,
            levelUp,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            completeChallenge,
            closeLevelUpModal,
        }}
        >
            {children}

            { isLevelUpModalOpen && <LevelUpModal/>}
        </ChallengesContext.Provider>
    );

}