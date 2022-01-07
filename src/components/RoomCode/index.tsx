import toast, { Toaster } from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';

import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
        toast.success('Código da sala copiado!');
    }

    return (
        <div>
            <Toaster
                position="top-right"
            />

            <ReactTooltip />

            <button className="room-code" onClick={copyRoomCodeToClipboard} data-tip="Copiar o código da sala">
                <div>
                    <img src={copyImg} alt="Copiar código da sala" />
                </div>
                <span>Sala #{props.code}</span>
            </button>
        </div>
    )
}