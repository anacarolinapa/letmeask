import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    },
    authorId: string;
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>;

type QuestionProps = {
    id: string,
    author: {
        name: string;
        avatar: string;
    },
    authorId: string;
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined;
};

export function useRoom(roomId: string) {
    // USUÁRIO LOGADO
    const { user } = useAuth();

    // PERGUNTAS
    const [questions, setQuestions] = useState<QuestionProps[]>([]);

    // TÍTULO
    const [title, setTitle] = useState('');

    // BUSCAR PERGUNTAS
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const FirebaseQuestions: FirebaseQuestions = room.val().questions ?? {};

            const parsedQuestions = Object.entries(FirebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    authorId: room.val().authorId,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            });

            // ALTERAR ORDENAÇÃO (DESC)
            parsedQuestions.reverse();

            setTitle(room.val().title);
            setQuestions(parsedQuestions);
        });

        return () => {
            roomRef.off('value');
        }
    }, [roomId, user?.id]);

    return { questions, title }
}