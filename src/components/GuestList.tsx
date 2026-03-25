import { useEffect, useState } from 'react'

const API_URL = 'https://17316ead6387d801.mokky.dev/users'

interface Guest {
    id: number
    name: string
    guests: string
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

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка загрузки')
            }

            setGuests(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    async function deleteGuest(id: number) {
        if (!confirm('Удалить гостя?')) return

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Ошибка удаления')

            setGuests(prev => prev.filter(g => g.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const totalGuests = guests.reduce((sum, g) => sum + Number(g.guests), 0)

    if (loading) return <div className="guest-list-loading">Загрузка...</div>
    if (error) return <div className="guest-list-error">Ошибка: {error}</div>

    return (
        <section className="guest-list">
            <h2 className="section-title">Список гостей</h2>

            <div className="guest-stats">
                <div className="stat">
                    <span className="stat-number">{guests.length}</span>
                    <span className="stat-label">подтвердили</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{totalGuests}</span>
                    <span className="stat-label">всего человек</span>
                </div>
            </div>

            {guests.length === 0 ? (
                <p className="no-guests">Пока никто не подтвердил 😢</p>
            ) : (
                <div className="guest-table-wrapper">
                    <table className="guest-table">
                        <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Гостей</th>
                            <th>Пожелание</th>
                            <th>Дата</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {guests.map(guest => (
                            <tr key={guest.id}>
                                <td>{guest.name}</td>
                                <td>{guest.guests}</td>
                                <td>{guest.message || '—'}</td>
                                <td>
                                    {new Date(guest.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteGuest(guest.id)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}