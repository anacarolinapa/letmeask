import { Link } from 'react-router-dom';

import questionImg from '../../assets/images/empty-questions.svg';

import './styles.scss';

type EmptyProps = {
    title: string;
};

export function Empty(props: EmptyProps) {
    return (
        <div className="empty-content">
            <div className="empty-area">
                <img src={questionImg} alt="Ilustração para mensagens" />
                <h1>{props.title}</h1>
                <p><Link to="/">Faça o seu login</Link> para interagir com os demais!</p>
            </div>
        </div>
    )
}
