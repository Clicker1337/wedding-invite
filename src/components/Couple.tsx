import { useInView } from '../hooks/useInView'

export default function Couple() {
    const { ref, isVisible } = useInView()

    return (
        <section className="couple" ref={ref}>
            <div className={`couple-content ${isVisible ? 'fade-up' : 'hidden'}`}>
                <h2 className="section-title">Дорогие гости!</h2>
                <div className="couple-card">
                    {/* Замени на фото молодожёнов */}
                    <img
                        src="/images/0377.jpg"
                        alt="Молодожёны"
                        className="couple-photo"
                    />
                    <div className="couple-text">
                        <p>
                            Мы рады сообщить, что решили объединить наши сердца
                            и приглашаем вас разделить с нами этот счастливый день!
                        </p>
                        <p>
                            Будем безмерно счастливы видеть вас на нашей свадьбе.
                            Ваше присутствие — лучший подарок для нас.
                        </p>
                        <div className="couple-signature">
                            С любовью, Денис и Анастасия ❤️
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}