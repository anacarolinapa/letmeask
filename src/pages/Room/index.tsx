import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import toast, { Toaster } from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';

import logoImg from '../../assets/images/logo.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';
import { Footer } from '../../components/Footer';
import { Empty } from '../../components/Empty';
import { Title } from '../../components/Title';
import { Loading } from '../../components/Loading';

import './styles.scss';

type RoomParams = {
    id: string;
}

export function Room() {
    // PARÂMETROS DA ROTA
    const params = useParams<RoomParams>();
    const roomId = params.id;

    // USUÁRIO LOGADO
    const { user } = useAuth();

    // NOVA PERGUNTA
    const [newQuestion, setNewQuestion] = useState('');

    // PERGUNTAS
    const { title, questions } = useRoom(roomId);

    // LOADING
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (title) {
            setLoading(false);
        }
    }, [title]);

    // ENVIAR PERGUNTA
    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            toast.error('Informe a pergunta!');
            return;
        }

        if (!user) {
            toast.error('Você deve estar logado!');
        }

        // "INSERIR" NO BANCO
        const question = {
            content: newQuestion.trim(),
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false, // SE ESTA COM DESTAQUE
            isAnswered: false // SE JÁ FOI RESPONDIDA
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        toast.success('Pergunta enviada!');
        setNewQuestion('');
    }

    // DAR LIKE
    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        // "INSERIR" OU "REMOVER" NO BANCO
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id
            });
        }
    }

    return (
        <div id="page-room">
            <Loading show={loading} />

            <Toaster
                position="top-right"
            />

            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" className="logo" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <Title text={`Sala ${title}`} textSecondary={`${questions.length}`} />

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <Link to="/"><button>faça seu login</button></Link>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                {questions.length > 0 &&
                    <div className="question-list">
                        <ReactTooltip />

                        {questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {!question.isAnswered &&
                                        <button
                                            className={`like-button ${question.likeId ? 'liked' : ''}`}
                                            type="button"
                                            aria-label="Marcar como gostei"
                                            onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                            data-tip={`${question.likeId ? 'Desmarcar como gostei' : 'Marcar como gostei'}`}
                                        >
                                            {question.likeCount > 0 &&
                                                <span>{question.likeCount}</span>
                                            }

                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    }
                                </Question>
                            );
                        })}
                    </div>
                }

                {questions.length === 0 &&
                    <Empty title="Nenhuma pergunta por aqui..." />
                }
            </main>

            <Footer />
        </div>
    )
}