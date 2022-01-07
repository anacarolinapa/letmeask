import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import toast, { Toaster } from 'react-hot-toast';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';

import { Button } from '../../components/Button';

import './styles.scss';

export function NewRoom() {
    const history = useHistory();

    // USUÁRIO LOGADO
    const { user } = useAuth();

    // NOME DA NOVA SALA
    const [newRoom, setNewRoom] = useState('');

    // ENVIAR FORMULÁRIO
    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            toast.error('Informe o nome da sala!');
            return;
        }

        // "INSERIR" NO BANCO
        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom.trim(),
            authorId: user?.id
        });

        // REDIRECIONAR
        history.push(`/rooms/${firebaseRoom.key}`);
    }

    return (
        <div id="page-new-room">
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

                    <h2>Criar uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                            required
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>

                    <p>
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}