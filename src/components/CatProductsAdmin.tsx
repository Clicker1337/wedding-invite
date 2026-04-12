import { useState } from 'react'
import type {CatProduct} from '../data/catFood'
// import { useCatProducts } from '../hooks/useCatProducts'

const CAT_API = 'https://17316ead6387d801.mokky.dev/cat-products'

// ==================== ТИПЫ ====================
type FormData = Omit<CatProduct, 'id'>

const emptyForm = (): FormData => ({
    brand: 'purina',
    name: '',
    weight: '',
    price: 0,
    oldPrice: null,
    shop: 'ozon',
    url: '',
    image: '',
    rating: 5.0,
    reviews: 0,
    tag: null,
    active: true,
})

// ==================== ХЕЛПЕРЫ ====================
const BRAND_LABELS: Record<string, string> = {
    purina: '🔵 Purina Pro Plan',
    grandorf: '🟤 Grandorf',
}

const SHOP_LABELS: Record<string, string> = {
    ozon: 'Ozon',
    wb: 'Wildberries',
}

const SHOP_COLORS: Record<string, string> = {
    ozon: '#005bff',
    wb: '#cb11ab',
}

// ==================== МОДАЛКА ФОРМЫ ====================
function ProductFormModal({
                              initial,
                              onSave,
                              onClose,
                              saving,
                          }: {
    initial: FormData
    onSave: (data: FormData) => Promise<void>
    onClose: () => void
    saving: boolean
}) {
    const [form, setForm] = useState<FormData>(initial)
    const [error, setError] = useState<string | null>(null)

    function set<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.name.trim()) return setError('Введите название')
        if (!form.url.trim()) return setError('Введите ссылку')
        if (form.price <= 0) return setError('Введите цену')
        setError(null)
        await onSave(form)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content cat-admin-modal"
                onClick={e => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose} disabled={saving}>
                    ✕
                </button>

                <h2 className="cat-admin-modal-title">
                    {initial.name ? `✏️ ${initial.name}` : '➕ Новый товар'}
                </h2>

                <form onSubmit={handleSubmit} className="cat-admin-form">
                    {/* Бренд + магазин */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Бренд</label>
                            <select
                                value={form.brand}
                                onChange={e => set('brand', e.target.value as FormData['brand'])}
                                disabled={saving}
                            >
                                <option value="purina">Purina Pro Plan</option>
                                <option value="grandorf">Grandorf</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Магазин</label>
                            <select
                                value={form.shop}
                                onChange={e => set('shop', e.target.value as FormData['shop'])}
                                disabled={saving}
                            >
                                <option value="ozon">Ozon</option>
                                <option value="wb">Wildberries</option>
                            </select>
                        </div>
                    </div>

                    {/* Название */}
                    <div className="form-group">
                        <label>Название</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            placeholder="Pro Plan Sterilised — Курица"
                            disabled={saving}
                            required
                        />
                    </div>

                    {/* Вес + тег */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Вес / объём</label>
                            <input
                                type="text"
                                value={form.weight}
                                onChange={e => set('weight', e.target.value)}
                                placeholder="3 кг"
                                disabled={saving}
                            />
                        </div>
                        <div className="form-group">
                            <label>Тег (необязательно)</label>
                            <input
                                type="text"
                                value={form.tag ?? ''}
                                onChange={e => set('tag', e.target.value || null)}
                                placeholder="🔥 Хит"
                                disabled={saving}
                            />
                        </div>
                    </div>

                    {/* Цена + старая цена */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Цена, ₽</label>
                            <input
                                type="number"
                                value={form.price || ''}
                                onChange={e => set('price', Number(e.target.value))}
                                placeholder="1549"
                                min={0}
                                disabled={saving}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Старая цена, ₽ (необязательно)</label>
                            <input
                                type="number"
                                value={form.oldPrice ?? ''}
                                onChange={e =>
                                    set('oldPrice', e.target.value ? Number(e.target.value) : null)
                                }
                                placeholder="1890"
                                min={0}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    {/* Рейтинг + отзывы */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Рейтинг (0–5)</label>
                            <input
                                type="number"
                                value={form.rating}
                                onChange={e => set('rating', Number(e.target.value))}
                                min={0}
                                max={5}
                                step={0.1}
                                disabled={saving}
                            />
                        </div>
                        <div className="form-group">
                            <label>Отзывов</label>
                            <input
                                type="number"
                                value={form.reviews || ''}
                                onChange={e => set('reviews', Number(e.target.value))}
                                placeholder="1200"
                                min={0}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    {/* Ссылка */}
                    <div className="form-group">
                        <label>Ссылка на товар</label>
                        <input
                            type="url"
                            value={form.url}
                            onChange={e => set('url', e.target.value)}
                            placeholder="https://ozon.ru/product/..."
                            disabled={saving}
                            required
                        />
                    </div>

                    {/* Фото */}
                    <div className="form-group">
                        <label>Ссылка на фото</label>
                        <input
                            type="url"
                            value={form.image}
                            onChange={e => set('image', e.target.value)}
                            placeholder="https://..."
                            disabled={saving}
                        />
                        {form.image && (
                            <div className="image-preview-wrap">
                                <img
                                    src={form.image}
                                    alt="preview"
                                    className="image-preview"
                                    onError={e => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Активен */}
                    <label className="cat-admin-toggle">
                        <input
                            type="checkbox"
                            checked={form.active}
                            onChange={e => set('active', e.target.checked)}
                            disabled={saving}
                        />
                        <span>Показывать гостям</span>
                    </label>

                    {error && <p className="cat-admin-error">⚠️ {error}</p>}

                    <div className="cat-admin-form-actions">
                        <button
                            type="button"
                            className="cat-admin-btn-cancel"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="cat-admin-btn-save"
                            disabled={saving}
                        >
                            {saving ? 'Сохраняем...' : '✓ Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ==================== КАРТОЧКА ТОВАРА В АДМИНКЕ ====================
function AdminProductCard({
                              product,
                              onEdit,
                              onToggleActive,
                              onDelete,
                              actionLoading,
                          }: {
    product: CatProduct
    onEdit: (p: CatProduct) => void
    onToggleActive: (p: CatProduct) => void
    onDelete: (p: CatProduct) => void
    actionLoading: number | null
}) {
    const isLoading = actionLoading === product.id
    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null

    return (
        <div className={`cat-admin-card ${!product.active ? 'cat-admin-card--inactive' : ''}`}>
            {/* Фото */}
            <div className="cat-admin-card-image-wrap">
                {!product.active && (
                    <div className="cat-admin-card-hidden-overlay">Скрыт</div>
                )}
                <img
                    src={product.image}
                    alt={product.name}
                    className="cat-admin-card-image"
                    onError={e => {
                        e.currentTarget.style.display = 'none'
                        const fb = e.currentTarget.nextElementSibling as HTMLElement
                        if (fb) fb.classList.remove('hidden')
                    }}
                />
                <span className="cat-product-image-fallback hidden">🐱</span>
            </div>

            {/* Инфо */}
            <div className="cat-admin-card-body">
                <div className="cat-admin-card-top">
                    <div>
            <span className="cat-admin-card-brand">
              {BRAND_LABELS[product.brand]}
            </span>
                        <p className="cat-admin-card-name">{product.name}</p>
                        <p className="cat-admin-card-weight">{product.weight}</p>
                    </div>

                    <div className="cat-admin-card-shop-badge">
            <span
                className="cat-admin-shop-label"
                style={{ color: SHOP_COLORS[product.shop] }}
            >
              {SHOP_LABELS[product.shop]}
            </span>
                        {product.tag && (
                            <span className="cat-admin-tag">{product.tag}</span>
                        )}
                    </div>
                </div>

                {/* Цены */}
                <div className="cat-admin-card-price-row">
          <span className="cat-admin-price">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
                    {product.oldPrice && (
                        <span className="cat-admin-old-price">
              {product.oldPrice.toLocaleString('ru-RU')} ₽
            </span>
                    )}
                    {discount && (
                        <span className="cat-admin-discount">−{discount}%</span>
                    )}
                </div>

                {/* Рейтинг */}
                <div className="cat-admin-card-rating">
          <span className="cat-product-stars">
            {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
          </span>
                    <span className="cat-product-reviews">
            {product.reviews.toLocaleString('ru-RU')} отз.
          </span>
                </div>

                {/* Действия */}
                <div className="cat-admin-card-actions">
                    <button
                        className="cat-admin-action-btn cat-admin-action-btn--edit"
                        onClick={() => onEdit(product)}
                        disabled={isLoading}
                        title="Редактировать"
                    >
                        ✏️
                    </button>

                    <button
                        className={`cat-admin-action-btn ${
                            product.active
                                ? 'cat-admin-action-btn--hide'
                                : 'cat-admin-action-btn--show'
                        }`}
                        onClick={() => onToggleActive(product)}
                        disabled={isLoading}
                        title={product.active ? 'Скрыть от гостей' : 'Показать гостям'}
                    >
                        {isLoading ? '...' : product.active ? '👁 Скрыть' : '👁 Показать'}
                    </button>

                    <button
                        className="cat-admin-action-btn cat-admin-action-btn--delete"
                        onClick={() => onDelete(product)}
                        disabled={isLoading}
                        title="Удалить"
                    >
                        🗑
                    </button>
                </div>
            </div>
        </div>
    )
}

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================
export default function CatProductsAdmin() {
    // const { products, loading, error, refetch } = useCatProducts()
    // const [allProducts, setAllProducts] = useState<CatProduct[]>([])
    // const [initialLoad, setInitialLoad] = useState(true)

    // При первой загрузке сохраняем ВСЕ продукты (включая неактивные)
    const [rawProducts, setRawProducts] = useState<CatProduct[]>([])
    const [rawLoading, setRawLoading] = useState(true)
    const [rawError, setRawError] = useState<string | null>(null)

    // Загружаем все товары (без фильтра active)
    useState(() => {
        fetch(CAT_API)
            .then(r => r.json())
            .then((data: CatProduct[]) => {
                setRawProducts(data)
                setRawLoading(false)
            })
            .catch(err => {
                setRawError(err.message)
                setRawLoading(false)
            })
    })

    const [filterBrand, setFilterBrand] = useState<'all' | 'purina' | 'grandorf'>('all')
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'hidden'>('all')
    const [editingProduct, setEditingProduct] = useState<CatProduct | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [saving, setSaving] = useState(false)
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<CatProduct | null>(null)

    async function fetchRaw() {
        setRawLoading(true)
        try {
            const r = await fetch(CAT_API)
            const data: CatProduct[] = await r.json()
            setRawProducts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setRawLoading(false)
        }
    }

    // Фильтрация
    const filtered = rawProducts.filter(p => {
        if (filterBrand !== 'all' && p.brand !== filterBrand) return false
        if (filterActive === 'active' && !p.active) return false
        if (filterActive === 'hidden' && p.active) return false
        return true
    })

    const stats = {
        total: rawProducts.length,
        active: rawProducts.filter(p => p.active).length,
        hidden: rawProducts.filter(p => !p.active).length,
        purina: rawProducts.filter(p => p.brand === 'purina').length,
        grandorf: rawProducts.filter(p => p.brand === 'grandorf').length,
    }

    // ========== CREATE ==========
    async function handleCreate(data: FormData) {
        setSaving(true)
        try {
            const r = await fetch(CAT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!r.ok) throw new Error('Ошибка создания')
            await fetchRaw()
            setIsCreating(false)
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    // ========== UPDATE ==========
    async function handleUpdate(data: FormData) {
        if (!editingProduct) return
        setSaving(true)
        try {
            const r = await fetch(`${CAT_API}/${editingProduct.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!r.ok) throw new Error('Ошибка обновления')
            await fetchRaw()
            setEditingProduct(null)
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    // ========== TOGGLE ACTIVE ==========
    async function handleToggleActive(product: CatProduct) {
        setActionLoading(product.id)
        try {
            const r = await fetch(`${CAT_API}/${product.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !product.active }),
            })
            if (!r.ok) throw new Error()
            setRawProducts(prev =>
                prev.map(p =>
                    p.id === product.id ? { ...p, active: !p.active } : p
                )
            )
        } catch (err) {
            console.error(err)
        } finally {
            setActionLoading(null)
        }
    }

    // ========== DELETE ==========
    async function handleDelete(product: CatProduct) {
        setActionLoading(product.id)
        try {
            const r = await fetch(`${CAT_API}/${product.id}`, {
                method: 'DELETE',
            })
            if (!r.ok) throw new Error()
            setRawProducts(prev => prev.filter(p => p.id !== product.id))
            setDeleteConfirm(null)
        } catch (err) {
            console.error(err)
        } finally {
            setActionLoading(null)
        }
    }

    if (rawLoading) {
        return (
            <div className="cat-admin-loading">
                <div className="cat-admin-spinner" />
                <p>Загрузка товаров...</p>
            </div>
        )
    }

    if (rawError) {
        return (
            <div className="cat-admin-error-block">
                <p>⚠️ {rawError}</p>
                <button onClick={fetchRaw} className="rsvp-button">
                    Повторить
                </button>
            </div>
        )
    }

    return (
        <div className="cat-admin">

            {/* ========== ШАПКА ========== */}
            <div className="cat-admin-header">
                <div>
                    <h2 className="cat-admin-title">🐱 Корм для котика</h2>
                    <p className="cat-admin-subtitle">Управление товарами в каталоге</p>
                </div>
                <button
                    className="cat-admin-add-btn"
                    onClick={() => setIsCreating(true)}
                >
                    + Добавить товар
                </button>
            </div>

            {/* ========== СТАТИСТИКА ========== */}
            <div className="cat-admin-stats">
                <div className="cat-admin-stat">
                    <span className="cat-admin-stat-num">{stats.total}</span>
                    <span className="cat-admin-stat-label">Всего</span>
                </div>
                <div className="cat-admin-stat">
          <span className="cat-admin-stat-num" style={{ color: '#388e3c' }}>
            {stats.active}
          </span>
                    <span className="cat-admin-stat-label">Активных</span>
                </div>
                <div className="cat-admin-stat">
          <span className="cat-admin-stat-num" style={{ color: '#aaa' }}>
            {stats.hidden}
          </span>
                    <span className="cat-admin-stat-label">Скрытых</span>
                </div>
                <div className="cat-admin-stat">
          <span className="cat-admin-stat-num" style={{ color: '#005bff' }}>
            {stats.purina}
          </span>
                    <span className="cat-admin-stat-label">Purina</span>
                </div>
                <div className="cat-admin-stat">
          <span className="cat-admin-stat-num" style={{ color: '#8b6f5e' }}>
            {stats.grandorf}
          </span>
                    <span className="cat-admin-stat-label">Grandorf</span>
                </div>
            </div>

            {/* ========== ФИЛЬТРЫ ========== */}
            <div className="cat-admin-filters">
                <div className="cat-admin-filter-group">
                    <span className="cat-admin-filter-label">Бренд:</span>
                    {(['all', 'purina', 'grandorf'] as const).map(b => (
                        <button
                            key={b}
                            className={`cat-admin-filter-btn ${filterBrand === b ? 'active' : ''}`}
                            onClick={() => setFilterBrand(b)}
                        >
                            {b === 'all' ? 'Все' : b === 'purina' ? '🔵 Purina' : '🟤 Grandorf'}
                        </button>
                    ))}
                </div>
                <div className="cat-admin-filter-group">
                    <span className="cat-admin-filter-label">Статус:</span>
                    {(['all', 'active', 'hidden'] as const).map(s => (
                        <button
                            key={s}
                            className={`cat-admin-filter-btn ${filterActive === s ? 'active' : ''}`}
                            onClick={() => setFilterActive(s)}
                        >
                            {s === 'all' ? 'Все' : s === 'active' ? '👁 Активные' : '🙈 Скрытые'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== СЕТКА ТОВАРОВ ========== */}
            {filtered.length === 0 ? (
                <div className="cat-admin-empty">
                    <p>Товары не найдены</p>
                    <button
                        className="cat-admin-add-btn"
                        onClick={() => setIsCreating(true)}
                    >
                        + Добавить первый товар
                    </button>
                </div>
            ) : (
                <div className="cat-admin-grid">
                    {filtered.map(product => (
                        <AdminProductCard
                            key={product.id}
                            product={product}
                            onEdit={p => setEditingProduct(p)}
                            onToggleActive={handleToggleActive}
                            onDelete={p => setDeleteConfirm(p)}
                            actionLoading={actionLoading}
                        />
                    ))}
                </div>
            )}

            {/* ========== МОДАЛКА СОЗДАНИЯ ========== */}
            {isCreating && (
                <ProductFormModal
                    initial={emptyForm()}
                    onSave={handleCreate}
                    onClose={() => setIsCreating(false)}
                    saving={saving}
                />
            )}

            {/* ========== МОДАЛКА РЕДАКТИРОВАНИЯ ========== */}
            {editingProduct && (
                <ProductFormModal
                    initial={{
                        brand: editingProduct.brand,
                        name: editingProduct.name,
                        weight: editingProduct.weight,
                        price: editingProduct.price,
                        oldPrice: editingProduct.oldPrice,
                        shop: editingProduct.shop,
                        url: editingProduct.url,
                        image: editingProduct.image,
                        rating: editingProduct.rating,
                        reviews: editingProduct.reviews,
                        tag: editingProduct.tag,
                        active: editingProduct.active,
                    }}
                    onSave={handleUpdate}
                    onClose={() => setEditingProduct(null)}
                    saving={saving}
                />
            )}

            {/* ========== МОДАЛКА УДАЛЕНИЯ ========== */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div
                        className="modal-content cat-delete-modal"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="cat-delete-icon">🗑️</div>
                        <h3 className="cat-delete-title">Удалить товар?</h3>
                        <p className="cat-delete-name">{deleteConfirm.name}</p>
                        <p className="cat-delete-hint">
                            Это действие нельзя отменить. Если хотите временно убрать —
                            лучше скройте товар.
                        </p>
                        <div className="cat-confirm-buttons">
                            <button
                                className="cat-confirm-cancel"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Отмена
                            </button>
                            <button
                                className="cat-admin-btn-delete-confirm"
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={actionLoading === deleteConfirm.id}
                            >
                                {actionLoading === deleteConfirm.id
                                    ? 'Удаляем...'
                                    : 'Удалить навсегда'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}