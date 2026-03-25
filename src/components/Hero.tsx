import { useEffect, useState } from 'react'

export default function Hero() {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setTimeout(() => setLoaded(true), 300)
    }, [])

    return (
        <section className="hero">
            {/* Замени src на свою фотку */}
            <div className="hero-overlay" />
            <img
                src="/images/hero-bg.jpeg"
                alt="Фон свадьбы"
                className="hero-bg"
            />

            <div className={`hero-content ${loaded ? 'animate-in' : ''}`}>
                <p className="hero-subtitle">Приглашение на свадьбу</p>
                <h1 className="hero-names">
                    <span className="name">Денис</span>
                    <span className="ampersand">&</span>
                    <span className="name">Анастасия</span>
                </h1>
                <div className="hero-date">
                    <div className="date-line" />
                    <p>16 апреля 2026 года</p>
                    <div className="date-line" />
                </div>
                <a href="#timeline" className="hero-arrow">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </a>
            </div>
        </section>
    )
}