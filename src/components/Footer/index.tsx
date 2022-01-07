import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

export function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <img src={logoImg} alt="Letmeask" />
                <span>Todos os direitos reservados.</span>
            </div>
        </footer>
    )
}
