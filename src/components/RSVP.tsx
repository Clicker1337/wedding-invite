import { useState } from 'react'
import { useInView } from '../hooks/useInView'

const API_URL = 'https://17316ead6387d801.mokky.dev/users'

interface Guest {
    id?: number
    name: string
    guests: string
    message: string
    createdAt: string
}

export default function RSVP() {
    const { ref, isVisible } = useInView()
    const [form, setForm] = useState({ name: '', guests: '1', message: '' })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const newGuest: Omit<Guest, 'id'> = {
                name: form.name,
                guests: form.guests,
                message: form.message,
                createdAt: new Date().toISOString(),
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGuest),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при отправке')
            }

            console.log('Гость сохранён:', data)
            setSubmitted(true)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
            console.error('Ошибка:', message)
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="rsvp" ref={ref}>
            <div className={`rsvp-content ${isVisible ? 'fade-up' : 'hidden'}`}>
                <h2 className="section-title">Подтвердите присутствие</h2>

                {submitted ? (
                    <div className="rsvp-thanks">
                        <p>🎉 Спасибо, {form.name}!</p>
                        <p>Мы ждём вас на нашем празднике!</p>
                    </div>
                ) : (
                    <form className="rsvp-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Ваше имя</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Иван Иванов"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="guests">Количество гостей</label>
                            <select
                                id="guests"
                                value={form.guests}
                                onChange={e => setForm({ ...form, guests: e.target.value })}
                                disabled={loading}
                            >
                                <option value="1">1</option>
                                <option value="2">2 (с парой)</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Пожелание (необязательно)</label>
                            <textarea
                                id="message"
                                placeholder="Ваши тёплые слова..."
                                rows={3}
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="rsvp-error">
                                ⚠️ {error}. Попробуйте ещё раз.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="rsvp-button"
                            disabled={loading}
                        >
                            {loading ? 'Отправляем...' : 'Подтверждаю ✓'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    )
}