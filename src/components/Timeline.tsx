import { useInView } from '../hooks/useInView'

interface TimelineEvent {
    time: string
    title: string
    description: string
    image: string
    imageAlt: string
}

const events: TimelineEvent[] = [
    {
        time: '13:40',
        title: 'Торжественная регистрация',
        description: 'Дворец бракосочетания №2 \n Фурштатская ул., 52, Санкт-Петербург.',
        image: '/images/zags.jpg',
        imageAlt: 'ЗАГС — место регистрации',
    },
    {
        time: '14:30',
        title: 'Прогулка',
        description: 'Фотосессия в парке «Таврический сад». Гости могут присоединиться или отдохнуть в ближайшем кафе.',
        image: '/images/walk.jpg',
        imageAlt: 'Место прогулки',
    },
    {
        time: '17:00',
        title: 'Праздничный ужин',
        description: 'Дом на воде "Whitemare", ул. Академика Павлова 11а. Вас ждёт вкусный ужин, музыка и танцы до утра!',
        image: '/images/dinner.webp',
        imageAlt: 'Ресторан для ужина',
    },
]

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
    const { ref, isVisible } = useInView(0.15)
    const isEven = index % 2 === 0

    return (
        <div
            ref={ref}
            className={`timeline-item ${isEven ? 'left' : 'right'} ${isVisible ? 'fade-up' : 'anim-hidden'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className="timeline-dot">
                <span>{event.time}</span>
            </div>

            <div className="timeline-card">
                <img src={event.image} alt={event.imageAlt} className="timeline-image" />
                <div className="timeline-card-body">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                </div>
            </div>
        </div>
    )
}

export default function Timeline() {
    const { ref, isVisible } = useInView()

    return (
        <section className="timeline-section" id="timeline">
            <div ref={ref} className={`${isVisible ? 'fade-up' : 'anim-hidden'}`}>
                <h2 className="section-title">Программа дня</h2>
            </div>
            <div className="timeline">
                <div className="timeline-line" />
                {events.map((event, i) => (
                    <TimelineItem key={i} event={event} index={i} />
                ))}
            </div>
        </section>
    )
}