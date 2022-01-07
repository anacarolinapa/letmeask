import './styles.scss';

type TitleProps = {
    text: string;
    textSecondary?: string | undefined;
}

export function Title(props: TitleProps) {
    return (
        <div className="title">
            <h1>{props.text}</h1>
            {props.textSecondary != '0' && props.textSecondary != undefined &&
                <span>{props.textSecondary} pergunta{props.textSecondary > '1' && 's'}</span>
            }
        </div>
    )
}
