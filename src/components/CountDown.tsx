import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'

// Замени на реальную дату свадьбы
const WEDDING_DATE = new Date('2026-04-16T13:40:00')

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

function calcTimeLeft(): TimeLeft {
    const diff = WEDDING_DATE.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    }
}

function pad(n: number) {
    return String(n).padStart(2, '0')
}

export default function Countdown() {
    const [time, setTime] = useState(calcTimeLeft)
    const { ref, isVisible } = useInView()

    useEffect(() => {
        const timer = setInterval(() => setTime(calcTimeLeft()), 1000)
        return () => clearInterval(timer)
    }, [])

    const blocks = [
        { value: time.days, label: 'дней' },
        { value: time.hours, label: 'часов' },
        { value: time.minutes, label: 'минут' },
        { value: time.seconds, label: 'секунд' },
    ]

    return (
        <section className="countdown" ref={ref}>
            <div className={`${isVisible ? 'fade-up' : 'anim-hidden'}`}>
                <h2 className="section-title">До свадьбы осталось</h2>
                <div className="countdown-grid">
                    {blocks.map((b, i) => (
                        <div
                            key={b.label}
                            className="countdown-block"
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <span className="countdown-number">{pad(b.value)}</span>
                            <span className="countdown-label">{b.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}