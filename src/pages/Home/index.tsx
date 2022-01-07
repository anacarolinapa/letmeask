import { FormEvent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import toast, { Toaster } from 'react-hot-toast';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';

import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';

import './styles.scss';

export function Home() {
    const history = useHistory();

    // USUÁRIO LOGADO
    const { user, signInWithGoogle } = useAuth();

    // SALA QUE DESEJA ACESSAR
    const [roomCode, setRoomCode] = useState('');

    // LOADING
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [user]);

    // CRIAR SALA
    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    // ENTRAR SALA
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            toast.error('Informe o código da sala!');
            return;
        }

        // VERIFICAR SE SALA EXISTE
        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            toast.error('Sala não existe!');
            return;
        }

        if (roomRef.val().endedAt) {
            toast.error('Esta sala encontra-se encerrada!');
            return;
        }

        // REDIRECIONAR
        history.push(`/rooms/${roomCode}`);
    }

    // VISUALIZAR SALAS
    async function handleViewRooms() {
        history.push(`/rooms`);
    }

    return (
        <div id="page-auth">
            <Loading show={loading} />

            <Toaster
                position="top-right"
            />

            <aside>
                <img src={illustrationImg} alt="Ilustração para perguntas e respostas" />
                <strong>Crie salas de Q&A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Logo" />

                    <button className='create-room' onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="Logo Google" />
                        Crie sua sala com o google
                    </button>

                    <div className='separator'>ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                            required
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>

                    {user &&
                        <Button type="button" onClick={handleViewRooms}>Ver salas</Button>
                    }
                </div>
            </main>
        </div>
    )
}