import { useState } from 'react'
import { useInView } from '../hooks/useInView'

const API_URL = 'https://17316ead6387d801.mokky.dev/users'

interface Companion {
    firstName: string
    lastName: string
}

interface FormData {
    firstName: string
    lastName: string
    guests: string
    companions: Companion[]
    message: string
}

const emptyCompanion = (): Companion => ({ firstName: '', lastName: '' })

export default function RSVP() {
    const { ref, isVisible } = useInView()
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<FormData>({
        firstName: '',
        lastName: '',
        guests: '1',
        companions: [],
        message: '',
    })

    function handleGuestsChange(value: string) {
        const count = Number(value)
        const companionCount = count - 1 // минус сам гость

        // Сохраняем уже заполненных, добавляем новых или обрезаем
        const updated = [...form.companions]
        while (updated.length < companionCount) {
            updated.push(emptyCompanion())
        }

        setForm({
            ...form,
            guests: value,
            companions: updated.slice(0, companionCount),
        })
    }

    function updateCompanion(index: number, field: keyof Companion, value: string) {
        const updated = [...form.companions]
        updated[index] = { ...updated[index], [field]: value }
        setForm({ ...form, companions: updated })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const payload = {
                firstName: form.firstName,
                lastName: form.lastName,
                guests: form.guests,
                companions: form.companions,
                message: form.message,
                createdAt: new Date().toISOString(),
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при отправке')
            }

            console.log('Сохранено:', data)
            setSubmitted(true)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
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
                        <p>🎉 Спасибо, {form.firstName}!</p>
                        <p>Мы ждём вас на нашем празднике!</p>
                    </div>
                ) : (
                    <form className="rsvp-form" onSubmit={handleSubmit}>

                        {/* --- Имя и Фамилия гостя --- */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">Ваше имя</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Иван"
                                    value={form.firstName}
                                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Ваша фамилия</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Иванов"
                                    value={form.lastName}
                                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* --- Количество гостей --- */}
                        <div className="form-group">
                            <label htmlFor="guests">Сколько вас будет?</label>
                            <select
                                id="guests"
                                value={form.guests}
                                onChange={e => handleGuestsChange(e.target.value)}
                                disabled={loading}
                            >
                                <option value="1">Я один / одна</option>
                                <option value="2">2 — с парой</option>
                                <option value="3">3 — с семьёй</option>
                                <option value="4">4 — с семьёй</option>
                            </select>
                        </div>

                        {/* --- Компаньоны (появляются динамически) --- */}
                        {form.companions.length > 0 && (
                            <div className="companions-section">
                                <p className="companions-title">
                                    Укажите {form.companions.length > 1 ? 'ваших спутников' : 'вашего спутника'}:
                                </p>

                                {form.companions.map((companion, index) => (
                                    <div key={index} className="companion-card">
                                        <span className="companion-number">Гость {index + 2}</span>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor={`comp-first-${index}`}>Имя</label>
                                                <input
                                                    id={`comp-first-${index}`}
                                                    type="text"
                                                    placeholder="Имя"
                                                    value={companion.firstName}
                                                    onChange={e => updateCompanion(index, 'firstName', e.target.value)}
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={`comp-last-${index}`}>Фамилия</label>
                                                <input
                                                    id={`comp-last-${index}`}
                                                    type="text"
                                                    placeholder="Фамилия"
                                                    value={companion.lastName}
                                                    onChange={e => updateCompanion(index, 'lastName', e.target.value)}
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* --- Пожелание --- */}
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

                        <button type="submit" className="rsvp-button" disabled={loading}>
                            {loading ? 'Отправляем...' : 'Подтверждаю ✓'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    )
}