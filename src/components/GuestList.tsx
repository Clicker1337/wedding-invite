import { useEffect, useState } from 'react'

const USERS_API = 'https://17316ead6387d801.mokky.dev/users'
const MENU_API = 'https://17316ead6387d801.mokky.dev/menu'

// ==================== ТИПЫ ====================
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
    deleted?: boolean
}

interface PersonMenu {
    firstName: string
    lastName: string
    salad: string
    main: string
    drink: string
}

interface MenuEntry {
    id: number
    self: PersonMenu
    companions: PersonMenu[]
    catFood: boolean
    catFoodBrand: string
    comment: string
    createdAt: string
    deleted?: boolean
}

// ==================== СЛОВАРИ ====================
const SALAD_LABELS: Record<string, string> = {
    turkey: 'Микс салат с индейкой гриль',
    eggplant: 'Салат с хрустящими баклажанами',
}

const MAIN_LABELS: Record<string, string> = {
    ribs: 'Томлёные говяжьи рёбрышки',
    tuna: 'Филе тунца',
}

const DRINK_LABELS: Record<string, string> = {
    water: 'Вода',
    juice: 'Сок',
    morse: 'Морс',
}

// ==================== ХЕЛПЕРЫ ====================
function normalizeName(str: string) {
    return str.trim().toLowerCase()
}

function fullName(first: string, last: string) {
    return `${first} ${last}`
}

function matchMenuToGuest(guest: Guest, menuEntries: MenuEntry[]): MenuEntry | undefined {
    const gFirst = normalizeName(guest.firstName)
    const gLast = normalizeName(guest.lastName)

    return menuEntries.find(entry => {
        const mFirst = normalizeName(entry.self.firstName)
        const mLast = normalizeName(entry.self.lastName)
        return mFirst === gFirst && mLast === gLast
    })
}

// ==================== КОМПОНЕНТ: МЕНЮ ОДНОГО ЧЕЛОВЕКА ====================
function PersonMenuView({ person, label }: { person: PersonMenu; label: string }) {
    return (
        <div className="person-menu-view">
            <span className="person-menu-view-label">{label}</span>
            <div className="person-menu-view-row">
                <span>🥗</span>
                <span>{SALAD_LABELS[person.salad] ?? person.salad ?? '—'}</span>
            </div>
            <div className="person-menu-view-row">
                <span>🍖</span>
                <span>{MAIN_LABELS[person.main] ?? person.main ?? '—'}</span>
            </div>
            <div className="person-menu-view-row">
                <span>🥤</span>
                <span>{DRINK_LABELS[person.drink] ?? person.drink ?? '—'}</span>
            </div>
        </div>
    )
}

// ==================== КОМПОНЕНТ: МОДАЛКА ====================
function GuestModal({
                        guest,
                        menu,
                        onClose,
                    }: {
    guest: Guest
    menu: MenuEntry | undefined
    onClose: () => void
}) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                {/* Шапка */}
                <div className="modal-header">
                    <h2 className="modal-name">
                        {fullName(guest.firstName, guest.lastName)}
                    </h2>
                    <span className="modal-date">
            Подтвердил {new Date(guest.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                    })}
          </span>
                </div>

                {/* Статус */}
                {guest.deleted && (
                    <div className="modal-deleted-badge">🗑 Помечен как удалённый</div>
                )}

                {/* RSVP — спутники */}
                <div className="modal-section">
                    <h3 className="modal-section-title">👥 Гости</h3>
                    <p className="modal-text">Всего: <strong>{guest.guests} чел.</strong></p>

                    {guest.companions && guest.companions.length > 0 && (
                        <div className="modal-companions">
                            {guest.companions.map((c, i) => (
                                <span key={i} className="companion-tag">
                  {fullName(c.firstName, c.lastName)}
                </span>
                            ))}
                        </div>
                    )}

                    {guest.message && (
                        <p className="modal-message">«{guest.message}»</p>
                    )}
                </div>

                {/* Меню */}
                <div className="modal-section">
                    <h3 className="modal-section-title">🍽️ Выбор блюд</h3>

                    {menu ? (
                        <>
                            <PersonMenuView
                                person={menu.self}
                                label={fullName(menu.self.firstName, menu.self.lastName)}
                            />

                            {menu.companions && menu.companions.map((c, i) => (
                                <PersonMenuView
                                    key={i}
                                    person={c}
                                    label={fullName(c.firstName, c.lastName)}
                                />
                            ))}

                            {menu.catFood && (
                                <div className="modal-cat">
                                    🐱 Закажет корм: <strong>{menu.catFoodBrand}</strong>
                                </div>
                            )}

                            {menu.comment && (
                                <p className="modal-comment">
                                    💬 {menu.comment}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="modal-no-menu">Меню ещё не выбрано</p>
                    )}
                </div>
            </div>
        </div>
    )
}

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================
export default function GuestList() {
    const [guests, setGuests] = useState<Guest[]>([])
    const [menuEntries, setMenuEntries] = useState<MenuEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
    const [showDeleted, setShowDeleted] = useState(false)

    useEffect(() => {
        fetchAll()
    }, [])

    async function fetchAll() {
        try {
            const [guestsRes, menuRes] = await Promise.all([
                fetch(USERS_API),
                fetch(MENU_API),
            ])
            const guestsData = await guestsRes.json()
            const menuData = await menuRes.json()

            if (!guestsRes.ok) throw new Error(guestsData.message)
            if (!menuRes.ok) throw new Error(menuData.message)

            setGuests(guestsData)
            setMenuEntries(menuData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки')
        } finally {
            setLoading(false)
        }
    }

    async function softDeleteGuest(e: React.MouseEvent, id: number) {
        e.stopPropagation()
        if (!confirm('Пометить гостя как удалённого?')) return

        try {
            const response = await fetch(`${USERS_API}/${id}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deleted: true }),
            })

            if (!response.ok) throw new Error('Ошибка')

            setGuests(prev =>
                prev.map(g => (g.id === id ? { ...g, deleted: true } : g))
            )

            // Закрываем модалку если удаляли оттуда
            if (selectedGuest?.id === id) {
                setSelectedGuest(prev => prev ? { ...prev, deleted: true } : null)
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function restoreGuest(e: React.MouseEvent, id: number) {
        e.stopPropagation()
        try {
            const response = await fetch(`${USERS_API}/${id}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deleted: false }),
            })

            if (!response.ok) throw new Error('Ошибка')

            setGuests(prev =>
                prev.map(g => (g.id === id ? { ...g, deleted: false } : g))
            )

            if (selectedGuest?.id === id) {
                setSelectedGuest(prev => prev ? { ...prev, deleted: false } : null)
            }
        } catch (err) {
            console.error(err)
        }
    }

    // ========== Фильтрация ==========
    const activeGuests = guests.filter(g => !g.deleted)
    const deletedGuests = guests.filter(g => g.deleted)
    const visibleGuests = showDeleted ? deletedGuests : activeGuests

    // ========== Статистика ==========
    const totalPeople = activeGuests.reduce((sum, g) => sum + Number(g.guests), 0)
    const menuFilled = activeGuests.filter(g => !!matchMenuToGuest(g, menuEntries)).length
    const catFoodCount = menuEntries.filter(m => m.catFood && !m.deleted).length

    if (loading) return <div className="guest-list-loading">Загрузка...</div>
    if (error) return <div className="guest-list-error">Ошибка: {error}</div>

    return (
        <section className="guest-list">

            {/* ========== СТАТИСТИКА ========== */}
            <div className="guest-stats">
                <div className="stat">
                    <span className="stat-number">{activeGuests.length}</span>
                    <span className="stat-label">подтвердили</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{totalPeople}</span>
                    <span className="stat-label">всего человек</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{menuFilled}</span>
                    <span className="stat-label">выбрали меню</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{catFoodCount}</span>
                    <span className="stat-label">🐱 корм</span>
                </div>
            </div>

            {/* ========== ПЕРЕКЛЮЧАТЕЛЬ ========== */}
            <div className="guest-tabs">
                <button
                    className={`guest-tab ${!showDeleted ? 'active' : ''}`}
                    onClick={() => setShowDeleted(false)}
                >
                    Активные ({activeGuests.length})
                </button>
                <button
                    className={`guest-tab ${showDeleted ? 'active' : ''}`}
                    onClick={() => setShowDeleted(true)}
                >
                    Удалённые ({deletedGuests.length})
                </button>
            </div>

            {/* ========== СПИСОК ГОСТЕЙ ========== */}
            {visibleGuests.length === 0 ? (
                <p className="no-guests">
                    {showDeleted ? 'Нет удалённых гостей' : 'Пока никто не подтвердил 😢'}
                </p>
            ) : (
                <div className="guest-cards">
                    {visibleGuests.map(guest => {
                        const menu = matchMenuToGuest(guest, menuEntries)
                        const hasMenu = !!menu

                        return (
                            <div
                                key={guest.id}
                                className={`guest-card ${guest.deleted ? 'guest-card--deleted' : ''}`}
                                onClick={() => setSelectedGuest(guest)}
                            >
                                <div className="guest-card-header">
                                    <div>
                                        <h3 className="guest-card-name">
                                            {fullName(guest.firstName, guest.lastName)}
                                        </h3>
                                        <span className="guest-card-count">
                      {Number(guest.guests) === 1
                          ? 'Придёт один'
                          : `Придёт: ${guest.guests} чел.`}
                    </span>
                                    </div>

                                    <div className="guest-card-actions">
                                        {/* Бейдж меню */}
                                        <span className={`menu-badge ${hasMenu ? 'menu-badge--done' : 'menu-badge--empty'}`}>
                      {hasMenu ? '🍽️ Выбрано' : '🍽️ Нет'}
                    </span>

                                        {/* Кнопка удаления / восстановления */}
                                        {guest.deleted ? (
                                            <button
                                                className="restore-btn"
                                                onClick={e => restoreGuest(e, guest.id)}
                                                title="Восстановить"
                                            >
                                                ↩
                                            </button>
                                        ) : (
                                            <button
                                                className="delete-btn"
                                                onClick={e => softDeleteGuest(e, guest.id)}
                                                title="Пометить удалённым"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {guest.companions && guest.companions.length > 0 && (
                                    <div className="guest-card-companions">
                                        <span className="companions-label">Спутники:</span>
                                        {guest.companions.map((c, i) => (
                                            <span key={i} className="companion-tag">
                        {fullName(c.firstName, c.lastName)}
                      </span>
                                        ))}
                                    </div>
                                )}

                                {guest.message && (
                                    <p className="guest-card-message">«{guest.message}»</p>
                                )}

                                <span className="guest-card-date">
                  {new Date(guest.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long',
                      hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ========== МОДАЛКА ========== */}
            {selectedGuest && (
                <GuestModal
                    guest={selectedGuest}
                    menu={matchMenuToGuest(selectedGuest, menuEntries)}
                    onClose={() => setSelectedGuest(null)}
                />
            )}
        </section>
    )
}