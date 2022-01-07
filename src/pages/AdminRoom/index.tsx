import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import toast, { Toaster } from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
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

export function AdminRoom() {
    // PARÂMETROS DA ROTA
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const history = useHistory();

    // USUÁRIO LOGADO
    const { user } = useAuth();

    // PERGUNTAS
    const { title, questions } = useRoom(roomId);

    // MODAL EXCLUIR PERGUNTA
    const [modalQuestion, setModalQuestion] = useState(false);

    // MODAL ENCERRAR SALA
    const [modalRoom, setModalRoom] = useState(false);

    // ID PERGUNTA
    const [questionId, setQuestionId] = useState('');

    // LOADING
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // VERIFICAR SE USUÁRIO LOGADO É O CRIADOR DA SALA, CASO CONTRÁRIO SERÁ REDIRECIONADO
        if (questions.length > 0 && user?.id !== questions[0].authorId) {
            history.push('/');
        }

        setLoading(false);
    }, [title, questions]);

    // ENCERRAR SALA
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date
        });

        history.push('/');
    }

    // ABRIR MODAL SALA
    function handleModalRoomOpen() {
        setModalRoom(true);
    }

    // FECHAR MODAL SALA
    function handleModalRoomCancel() {
        setModalRoom(false);
    }

    // DELETAR PERGUNTA
    async function handleDeleteQuestion(questionId: string) {
        handleModalQuestionCancel();
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        toast.success('Pergunta excluída!');
    }

    // ABRIR MODAL PERGUNTA
    function handleModalQuestionOpen(questionId: string) {
        setModalQuestion(true);
        setQuestionId(questionId);
    }

    // FECHAR MODAL PERGUNTA
    function handleModalQuestionCancel() {
        setModalQuestion(false);
    }

    // MARCAR PERGUNTA COMO RESPONDIDA
    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
        toast.success('Pergunta marcada como respondida!');
    }

    // DESTACAR PERGUNTA
    async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: !isHighlighted
        });
        toast.success(`${!isHighlighted ? 'Pergunta destacada!' : 'Pergunta removida de destaque!'}`);
    }

    return (
        <div id="page-room-admin">
            <Loading show={loading} />

            {modalQuestion &&
                <Modal title="Excluir pergunta" content="Tem certeza que você deseja excluir esta pergunta?" cancelModal={() => handleModalQuestionCancel()} confirmModal={() => handleDeleteQuestion(questionId)} />
            }

            {modalRoom &&
                <Modal title="Encerrar sala" content="Tem certeza que você deseja encerrar esta sala?" cancelModal={() => handleModalRoomCancel()} confirmModal={() => handleEndRoom()} />
            }

            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" className="logo" />
                    <div>
                        <RoomCode code={roomId} />

                        <Button
                            isOutlined
                            onClick={handleModalRoomOpen}
                            data-tip="Encerrar esta sala"
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <Title text={`Sala ${title}`} textSecondary={`${questions.length}`} />

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
                                    {!question.isAnswered && question.authorId === user?.id && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                                aria-label="Marcar pergunta como respondida"
                                                data-tip="Marcar pergunta como respondida"
                                            >
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                                aria-label={`${question.isHighlighted ? 'Remover destaque da pergunta' : 'Dar destaque à pergunta'}`}
                                                data-tip={`${question.isHighlighted ? 'Remover destaque da pergunta' : 'Dar destaque à pergunta'}`}
                                            >
                                                <img src={answerImg} alt={`${question.isHighlighted ? 'Remover destaque da pergunta' : 'Dar destaque à pergunta'}`} />
                                            </button>
                                        </>
                                    )}

                                    {question.authorId === user?.id &&
                                        <button
                                            type="button"
                                            onClick={() => handleModalQuestionOpen(question.id)}
                                            aria-label="Remover pergunta"
                                            data-tip="Remover pergunta"
                                        >
                                            <img src={deleteImg} alt="Remover pergunta" />
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