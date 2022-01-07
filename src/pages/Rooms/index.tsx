import { useState, useEffect } from 'react';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';

import { Footer } from '../../components/Footer';
import { Empty } from '../../components/Empty';
import { Room } from '../../components/Room';
import { Title } from '../../components/Title';
import { Loading } from '../../components/Loading';

import './styles.scss';

type RoomsProps = {
    id: string;
    title: string;
    endedAt: Date;
};

export function Rooms() {
    // SALAS
    const [rooms, setRooms] = useState<RoomsProps[]>([]);

    // LOADING
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const roomRef = database.ref(`rooms/`);

        roomRef.once('value', room => {
            const FirebaseRooms: object = room.val() ?? {};

            const parsedRooms = Object.entries(FirebaseRooms).map(([key, value]) => {
                return {
                    id: key,
                    title: value.title,
                    endedAt: value.endedAt,
                }
            });

            setRooms(parsedRooms);
            setLoading(false);
        });

        return () => {
            roomRef.off('value');
        }
    }, []);

    return (
        <div id="page-rooms">
            <Loading show={loading} />

            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                </div>
            </header>

            <main>
                <Title text="Salas" />

                {rooms.length > 0 &&
                    <div className="room-list">
                        {rooms.map(room => {
                            return (
                                <Room
                                    key={room.id}
                                    id={room.id}
                                    title={room.title}
                                    endedAt={room.endedAt}
                                />
                            );
                        })}
                    </div>
                }

                {rooms.length === 0 &&
                    <Empty title="Nenhuma sala por aqui..." />
                }
            </main>

            <Footer />
        </div>
    )
}