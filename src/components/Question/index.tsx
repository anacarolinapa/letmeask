import { ReactNode } from 'react';

import './styles.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    children?: ReactNode,
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({ content, author, children, isAnswered = false, isHighlighted = false }: QuestionProps) {

    let tootip = "";
    if (isAnswered) {
        tootip = "Pergunta encerrada";
    } else if (isHighlighted) {
        tootip = "Pergunta em destaque";
    }

    return (
        <div
            className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted && !isAnswered ? 'highlighted' : ''}`}
            data-tip={tootip}
        >
            <p>{content}</p>
            <div className="footer">
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}