import { useEffect, useState } from 'react'

const API_URL = 'https://17316ead6387d801.mokky.dev/users'

interface Companion {
    firstName: string
    lastName: string
}

interface Guest {
    id: number
    firstName: string
    lastName: string
    guests: string
    companions: Companion[]
    message: string
    createdAt: string
}

export default function GuestList() {
    const [guests, setGuests] = useState<Guest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchGuests()
    }, [])

    async function fetchGuests() {
        try {
            const response = await fetch(API_URL)
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Ошибка загрузки')
            setGuests(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка')
        } finally {
            setLoading(false)
        }
    }

    async function deleteGuest(id: number) {
        if (!confirm('Удалить гостя?')) return
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Ошибка удаления')
            setGuests(prev => prev.filter(g => g.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const totalPeople = guests.reduce((sum, g) => sum + Number(g.guests), 0)

    if (loading) return <div className="guest-list-loading">Загрузка...</div>
    if (error) return <div className="guest-list-error">Ошибка: {error}</div>

    return (
        <section className="guest-list">
            <div className="guest-stats">
                <div className="stat">
                    <span className="stat-number">{guests.length}</span>
                    <span className="stat-label">подтвердили</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{totalPeople}</span>
                    <span className="stat-label">всего человек</span>
                </div>
            </div>

            {guests.length === 0 ? (
                <p className="no-guests">Пока никто не подтвердил 😢</p>
            ) : (
                <div className="guest-cards">
                    {guests.map(guest => (
                        <div key={guest.id} className="guest-card">
                            <div className="guest-card-header">
                                <div>
                                    <h3 className="guest-card-name">
                                        {guest.firstName} {guest.lastName}
                                    </h3>
                                    <span className="guest-card-count">
                    {Number(guest.guests) === 1
                        ? 'Придёт один'
                        : `Придёт: ${guest.guests} чел.`}
                  </span>
                                </div>
                                <button className="delete-btn" onClick={() => deleteGuest(guest.id)}>
                                    ✕
                                </button>
                            </div>

                            {guest.companions && guest.companions.length > 0 && (
                                <div className="guest-card-companions">
                                    <span className="companions-label">Спутники:</span>
                                    {guest.companions.map((c, i) => (
                                        <span key={i} className="companion-tag">
                      {c.firstName} {c.lastName}
                    </span>
                                    ))}
                                </div>
                            )}

                            {guest.message && (
                                <p className="guest-card-message">«{guest.message}»</p>
                            )}

                            <span className="guest-card-date">
                {new Date(guest.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
              </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}