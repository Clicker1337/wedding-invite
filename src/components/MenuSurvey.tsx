import { useState } from 'react'
import CatFoodPicker from './CatFoodPicker'

const API_URL = 'https://17316ead6387d801.mokky.dev/menu'

// ==================== МЕНЮ ====================
const SALADS = [
    {
        id: 'turkey',
        label: 'Микс салат с индейкой гриль',
        desc: 'хрустящие овощи и соус Терияки',
    },
    {
        id: 'eggplant',
        label: 'Салат с хрустящими баклажанами',
        desc: 'свежие томаты и свит-чили соус',
    },
]

const MAINS = [
    {
        id: 'ribs',
        label: 'Томлёные говяжьи рёбрышки',
        desc: 'картофельное пюре и мясной соус',
    },
    {
        id: 'tuna',
        label: 'Филе тунца',
        desc: 'сезонные овощи и паназиатский соус',
    },
]

const DRINKS = [
    { id: 'water', label: 'Вода' },
    { id: 'juice', label: 'Сок' },
    { id: 'morse', label: 'Морс' },
]

// ==================== ТИПЫ ====================
interface PersonMenu {
    firstName: string
    lastName: string
    salad: string
    main: string
    drink: string
}

interface FormState {
    self: PersonMenu
    companions: PersonMenu[]
    companionCount: string
    catFood: boolean
    catFoodBrand: string
    comment: string
}

const emptyPerson = (): PersonMenu => ({
    firstName: '',
    lastName: '',
    salad: '',
    main: '',
    drink: '',
})

// ==================== КОМПОНЕНТ ВЫБОРА МЕНЮ ====================
function PersonMenuForm({
                            person,
                            index,
                            onChange,
                            isSelf,
                            disabled,
                        }: {
    person: PersonMenu
    index: number
    onChange: (updated: PersonMenu) => void
    isSelf: boolean
    disabled: boolean
}) {
    const title = isSelf ? 'Ваш выбор' : `Гость ${index + 2}`

    return (
        <div className="person-menu-card">
            <div className="person-menu-header">
                <span className="person-menu-number">{title}</span>
            </div>

            {!isSelf && (
                <div className="form-row">
                    <div className="form-group">
                        <label>Имя спутника</label>
                        <input
                            type="text"
                            placeholder="Имя"
                            value={person.firstName}
                            onChange={e => onChange({ ...person, firstName: e.target.value })}
                            required
                            disabled={disabled}
                        />
                    </div>
                    <div className="form-group">
                        <label>Фамилия спутника</label>
                        <input
                            type="text"
                            placeholder="Фамилия"
                            value={person.lastName}
                            onChange={e => onChange({ ...person, lastName: e.target.value })}
                            required
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}

            {/* Салат */}
            <div className="form-group">
                <label>🥗 Салат</label>
                <div className="radio-group">
                    {SALADS.map(item => (
                        <label key={item.id} className={`radio-card ${person.salad === item.id ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name={`salad-${index}`}
                                value={item.id}
                                checked={person.salad === item.id}
                                onChange={() => onChange({ ...person, salad: item.id })}
                                required
                                disabled={disabled}
                            />
                            <div className="radio-content">
                                <span className="radio-label">{item.label}</span>
                                <span className="radio-desc">{item.desc}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Горячее */}
            <div className="form-group">
                <label>🍖 Горячее</label>
                <div className="radio-group">
                    {MAINS.map(item => (
                        <label key={item.id} className={`radio-card ${person.main === item.id ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name={`main-${index}`}
                                value={item.id}
                                checked={person.main === item.id}
                                onChange={() => onChange({ ...person, main: item.id })}
                                required
                                disabled={disabled}
                            />
                            <div className="radio-content">
                                <span className="radio-label">{item.label}</span>
                                <span className="radio-desc">{item.desc}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Напиток */}
            <div className="form-group">
                <label>🥤 Напиток (0,5л)</label>
                <div className="radio-group radio-group--inline">
                    {DRINKS.map(item => (
                        <label key={item.id} className={`radio-card radio-card--small ${person.drink === item.id ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name={`drink-${index}`}
                                value={item.id}
                                checked={person.drink === item.id}
                                onChange={() => onChange({ ...person, drink: item.id })}
                                required
                                disabled={disabled}
                            />
                            <div className="radio-content">
                                <span className="radio-label">{item.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================
export default function MenuSurvey() {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState<'identity' | 'menu'>('identity')

    const [form, setForm] = useState<FormState>({
        self: { ...emptyPerson() },
        companions: [],
        companionCount: '0',
        catFood: false,
        catFoodBrand: '',
        comment: '',
    })

    function handleCompanionCount(value: string) {
        const count = Number(value)
        const updated = [...form.companions]
        while (updated.length < count) updated.push(emptyPerson())
        setForm({
            ...form,
            companionCount: value,
            companions: updated.slice(0, count),
        })
    }

    function updateCompanion(index: number, updated: PersonMenu) {
        const companions = [...form.companions]
        companions[index] = updated
        setForm({ ...form, companions })
    }

    function handleIdentitySubmit(e: React.FormEvent) {
        e.preventDefault()
        setStep('menu')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleMenuSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const payload = {
                self: {
                    firstName: form.self.firstName,
                    lastName: form.self.lastName,
                    salad: form.self.salad,
                    main: form.self.main,
                    drink: form.self.drink,
                },
                companions: form.companions,
                catFood: form.catFood,
                catFoodBrand: form.catFood ? form.catFoodBrand : '',
                comment: form.comment,
                createdAt: new Date().toISOString(),
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Ошибка')

            setSubmitted(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
        } finally {
            setLoading(false)
        }
    }

    // ========== УСПЕХ ==========
    if (submitted) {
        return (
            <div className="menu-page">
                <div className="menu-success">
                    <div className="menu-success-icon">🎉</div>
                    <h2>Спасибо, {form.self.firstName}!</h2>
                    <p>Ваш выбор блюд сохранён. Мы с нетерпением ждём вас!</p>
                    <a href="/" className="rsvp-button" style={{ display: 'inline-block', marginTop: '1rem' }}>
                        ← На главную
                    </a>
                </div>
            </div>
        )
    }

    // ========== ШАГ 1: КТО ВЫ? ==========
    if (step === 'identity') {
        return (
            <div className="menu-page">
                <div className="menu-hero">
                    <a href="/" className="menu-back">← На главную</a>
                    <h1 className="section-title">Выбор блюд</h1>
                    <p className="menu-subtitle">
                        Помогите нам подготовиться — выберите блюда для себя и ваших спутников
                    </p>
                </div>

                {/* Блок про кота */}
                <div className="cat-banner">
                    <div className="cat-banner-icon">🐱</div>
                    <div className="cat-banner-text">
                        <strong>Вместо цветов и алкоголя</strong> — порадуйте нашего любимого
                        котика! Закажите ему корм <strong>Purina Pro Plan</strong> или{' '}
                        <strong>Grandorf</strong> через Озон на адрес:{' '}
                        <strong>проспект Строителей, 2</strong> 🛒
                    </div>
                </div>

                <form className="rsvp-form menu-form" onSubmit={handleIdentitySubmit}>
                    <h3 className="form-section-title">Ваши данные</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Ваше имя</label>
                            <input
                                type="text"
                                placeholder="Иван"
                                value={form.self.firstName}
                                onChange={e =>
                                    setForm({ ...form, self: { ...form.self, firstName: e.target.value } })
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ваша фамилия</label>
                            <input
                                type="text"
                                placeholder="Иванов"
                                value={form.self.lastName}
                                onChange={e =>
                                    setForm({ ...form, self: { ...form.self, lastName: e.target.value } })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Вы придёте со спутниками?</label>
                        <select
                            value={form.companionCount}
                            onChange={e => handleCompanionCount(e.target.value)}
                        >
                            <option value="0">Нет, я один / одна</option>
                            <option value="1">Да, 1 спутник</option>
                            <option value="2">Да, 2 спутника</option>
                            <option value="3">Да, 3 спутника</option>
                        </select>
                    </div>

                    <button type="submit" className="rsvp-button">
                        Перейти к выбору меню →
                    </button>
                </form>
            </div>
        )
    }

    // ========== ШАГ 2: МЕНЮ ==========
    return (
        <div className="menu-page">
            <div className="menu-hero">
                <button className="menu-back" onClick={() => setStep('identity')}>
                    ← Назад
                </button>
                <h1 className="section-title">Выбор блюд</h1>
                <p className="menu-subtitle">
                    {form.self.firstName}, выберите блюда для себя
                    {form.companions.length > 0 ? ' и ваших спутников' : ''}
                </p>
            </div>

            {/* Блок меню — справочник */}
            <details className="menu-reference">
                <summary>📋 Посмотреть полное меню</summary>
                <div className="menu-reference-content">
                    <div className="menu-section">
                        <h4>🧊 Холодные закуски (400г, общие)</h4>
                        <ul>
                            <li>Брускетта с тар-таром из горной форели со свежим огурцом и микрозеленью</li>
                            <li>Ростбиф из мраморной говядины с мягким сыром и микрозеленью</li>
                            <li>Тигровые креветки с лаймовым авокадо</li>
                            <li>Сырное плато с мёдом и орешками (Пармезан / Маасдам / Чеддер / Бри / Дор Блю)</li>
                            <li>Ассорти мясных колбас (Балык / Салями Милано / Сальчичон)</li>
                            <li>Антипасти (Перчики / Оливки / Патисоны)</li>
                        </ul>
                    </div>
                    <div className="menu-section">
                        <h4>🥗 Салаты (200г, на выбор)</h4>
                        <ul>
                            <li>Микс салат с индейкой гриль, хрустящими овощами и соусом Терияки</li>
                            <li>Салат с хрустящими баклажанами, свежими томатами и свит-чили соусом</li>
                        </ul>
                    </div>
                    <div className="menu-section">
                        <h4>🍖 Горячее (200г, на выбор)</h4>
                        <ul>
                            <li>Томлёные говяжьи рёбрышки с картофельным пюре и мясным соусом</li>
                            <li>Филе тунца с сезонными овощами и паназиатским соусом</li>
                        </ul>
                    </div>
                    <div className="menu-section">
                        <h4>🍮 Десерт (200г, общие)</h4>
                        <ul>
                            <li>Сезонные фрукты и ягоды ассорти</li>
                            <li>Ванильная Панна Котта с клубничным соусом и свежими ягодами</li>
                        </ul>
                    </div>
                </div>
            </details>

            <form className="rsvp-form menu-form" onSubmit={handleMenuSubmit}>
                {/* Форма для себя */}
                <PersonMenuForm
                    person={form.self}
                    index={0}
                    isSelf={true}
                    disabled={loading}
                    onChange={updated => setForm({...form, self: updated})}
                />

                {/* Формы для спутников */}
                {form.companions.map((companion, index) => (
                    <PersonMenuForm
                        key={index}
                        person={companion}
                        index={index}
                        isSelf={false}
                        disabled={loading}
                        onChange={updated => updateCompanion(index, updated)}
                    />
                ))}

                {/* Блок про кота */}
                <div className="form-group cat-section">
                    <label className="cat-checkbox-label">
                        <input
                            type="checkbox"
                            checked={form.catFood}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    catFood: e.target.checked,
                                    catFoodBrand: e.target.checked ? form.catFoodBrand : '',
                                })
                            }
                            disabled={loading}
                        />
                        <span>
      🐱 Вместо цветов / алкоголя закажу корм для котика
      <br/>
      <small>Адрес: пр. Строителей, 2 (Озон / Вайлдберриз)</small>
    </span>
                    </label>

                    {form.catFood && (
                        <div className="cat-picker-wrapper">
                            <CatFoodPicker
                                selectedBrand={form.catFoodBrand}
                                onBrandSelect={brand => setForm({...form, catFoodBrand: brand})}
                                disabled={loading}
                            />
                        </div>
                    )}
                </div>

                {/* Комментарий */}
                <div className="form-group">
                    <label>Комментарий (аллергии, пожелания)</label>
                    <textarea
                        placeholder="Например: аллергия на орехи..."
                        rows={3}
                        value={form.comment}
                        onChange={e => setForm({...form, comment: e.target.value})}
                        disabled={loading}
                    />
                </div>

                {error && <div className="rsvp-error">⚠️ {error}. Попробуйте ещё раз.</div>}

                <button type="submit" className="rsvp-button" disabled={loading}>
                    {loading ? 'Отправляем...' : 'Сохранить выбор ✓'}
                </button>
            </form>
        </div>
    )
}