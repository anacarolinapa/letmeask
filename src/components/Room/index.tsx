import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import './styles.scss';

type RoomProps = {
    id: string;
    title: string;
    endedAt?: Date;
}

export function Room({ id, title, endedAt }: RoomProps) {
    return (
        <Link to={`${!endedAt ? `rooms/${id}` : '#'}`} className="room-link">
            <ReactTooltip />
            <div
                className={`room ${endedAt ? 'ended' : ''}`}
                data-tip={`${endedAt ? 'Sala encerrada' : 'Acessar sala'}`}
            >
                <span>{title}</span>
            </div>
        </Link>
    );
}