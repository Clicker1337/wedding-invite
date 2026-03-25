import { useInView } from '../hooks/useInView'

const photos = [
    { src: '/images/0261.jpg', alt: 'Мы вместе' },
    { src: '/images/0268.jpg', alt: 'ЗАГС' },
    { src: '/images/0312.jpg', alt: 'Место ужина' },
    { src: '/images/0342.jpg', alt: 'Прогулка' },
    { src: '/images/0387.jpg', alt: 'Наша история' },
    { src: '/images/0427.jpg', alt: 'Счастье' },
]

export default function Gallery() {
    const { ref, isVisible } = useInView()

    return (
        <section className="gallery" ref={ref}>
            <div className={`${isVisible ? 'fade-up' : 'hidden'}`}>
                <h2 className="section-title">Наши фотографии</h2>
                <div className="gallery-grid">
                    {photos.map((photo, i) => (
                        <div
                            key={i}
                            className={`gallery-item ${isVisible ? 'scale-in' : ''}`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <img src={photo.src} alt={photo.alt} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}