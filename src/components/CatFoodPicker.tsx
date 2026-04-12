import { useState } from 'react'
import type {CatProduct} from '../data/catFood'
import { useCatProducts } from '../hooks/useCatProducts'

const ADDRESS = 'проспект Строителей, 2'

// ==================== КАРТОЧКА ТОВАРА ====================
function ProductCard({ product }: { product: CatProduct }) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [copied, setCopied] = useState(false)

    function handleClick(e: React.MouseEvent) {
        e.preventDefault()
        setShowConfirm(true)
    }

    function copyAddress() {
        navigator.clipboard.writeText(ADDRESS).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        })
    }

    function goToShop() {
        window.open(product.url, '_blank', 'noopener,noreferrer')
        setShowConfirm(false)
    }

    const isOzon = product.shop === 'ozon'
    const shopLabel = isOzon ? 'Ozon' : 'Wildberries'
    const shopColor = isOzon ? '#005bff' : '#cb11ab'
    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null

    return (
        <>
            <a
                href={product.url}
                className="cat-product-card"
                onClick={handleClick}
                rel="noopener noreferrer"
            >
                {/* Тег */}
                {product.tag && (
                    <span className="cat-product-tag">{product.tag}</span>
                )}

                {/* Скидка */}
                {discount && (
                    <span className="cat-product-discount">−{discount}%</span>
                )}

                {/* Фото */}
                <div className="cat-product-image-wrap">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="cat-product-image"
                        loading="lazy"
                        onError={e => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.classList.remove('hidden')
                        }}
                    />
                    <span className="cat-product-image-fallback hidden">🐱</span>
                </div>

                {/* Инфо */}
                <div className="cat-product-info">
                    <p className="cat-product-name">{product.name}</p>
                    <p className="cat-product-weight">{product.weight}</p>

                    <div className="cat-product-rating">
            <span className="cat-product-stars">
              {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
                        <span className="cat-product-reviews">
              {product.reviews.toLocaleString('ru-RU')}
            </span>
                    </div>

                    <div className="cat-product-price-row">
            <span className="cat-product-price">
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
                        {product.oldPrice && (
                            <span className="cat-product-old-price">
                {product.oldPrice.toLocaleString('ru-RU')} ₽
              </span>
                        )}
                    </div>

                    <span className="cat-product-shop" style={{ color: shopColor }}>
            {shopLabel} →
          </span>
                </div>
            </a>

            {/* ========== МОДАЛКА ========== */}
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div
                        className="modal-content cat-confirm-modal"
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="modal-close" onClick={() => setShowConfirm(false)}>
                            ✕
                        </button>

                        <div className="cat-confirm-icon">🐱</div>
                        <h3 className="cat-confirm-title">Не забудьте адрес!</h3>

                        <div className="cat-confirm-product">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="cat-confirm-product-img"
                                onError={e => { e.currentTarget.style.display = 'none' }}
                            />
                            <div>
                                <p className="cat-confirm-product-name">{product.name}</p>
                                <p className="cat-confirm-product-weight">{product.weight}</p>
                                <p className="cat-confirm-product-price">
                                    {product.price.toLocaleString('ru-RU')} ₽
                                </p>
                            </div>
                        </div>

                        <div className="cat-confirm-address">
                            <span className="cat-confirm-address-icon">📍</span>
                            <div>
                                <p className="cat-confirm-address-label">Адрес доставки котику:</p>
                                <p className="cat-confirm-address-value">{ADDRESS}</p>
                            </div>
                        </div>

                        <button className="cat-copy-btn" onClick={copyAddress}>
                            {copied ? '✅ Скопировано!' : '📋 Скопировать адрес'}
                        </button>

                        <p className="cat-confirm-hint">
                            Скопируйте адрес и укажите его при оформлении заказа вместо своего
                        </p>

                        <div className="cat-confirm-buttons">
                            <button
                                className="cat-confirm-cancel"
                                onClick={() => setShowConfirm(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="cat-confirm-go"
                                style={{ background: shopColor }}
                                onClick={goToShop}
                            >
                                На {shopLabel} →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// ==================== СКЕЛЕТОН ====================
function ProductSkeleton() {
    return (
        <div className="cat-product-skeleton">
            <div className="skeleton-image" />
            <div className="skeleton-line skeleton-line--long" />
            <div className="skeleton-line skeleton-line--short" />
            <div className="skeleton-line skeleton-line--medium" />
        </div>
    )
}

// ==================== СПИСОК ТОВАРОВ ====================
function ProductList({
                         products,
                         loading,
                         error,
                     }: {
    products: CatProduct[]
    loading: boolean
    error: string | null
}) {
    if (error) {
        return (
            <p className="cat-products-error">
                ⚠️ Не удалось загрузить товары. Попробуйте позже.
            </p>
        )
    }

    if (loading) {
        return (
            <div className="cat-products-scroll">
                {Array.from({ length: 4 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return <p className="cat-products-empty">Товары не найдены</p>
    }

    return (
        <div className="cat-products-scroll">
            {products.map(p => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    )
}

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================
interface Props {
    selectedBrand: string
    onBrandSelect: (brand: string) => void
    disabled: boolean
}

export default function CatFoodPicker({ selectedBrand, onBrandSelect, disabled }: Props) {
    const { products, loading, error } = useCatProducts()

    const brands = [
        { id: 'Purina Pro Plan', label: 'Purina Pro Plan', emoji: '🔵' },
        { id: 'Grandorf', label: 'Grandorf', emoji: '🟤' },
        { id: 'Оба!', label: 'Оба варианта', emoji: '🎉' },
    ]

    // Фильтрация по выбранному бренду
    const purinaProducts = products.filter(p => p.brand === 'purina')
    const grandorfProducts = products.filter(p => p.brand === 'grandorf')

    // const showPurina = selectedBrand === 'Purina Pro Plan' || selectedBrand === 'Оба!'
    // const showGrandorf = selectedBrand === 'Grandorf' || selectedBrand === 'Оба!'

    return (
        <div className="cat-food-picker">

            {/* Выбор бренда */}
            <div className="cat-brand-buttons">
                {brands.map(b => (
                    <button
                        key={b.id}
                        type="button"
                        className={`cat-brand-btn ${selectedBrand === b.id ? 'active' : ''}`}
                        onClick={() => onBrandSelect(b.id)}
                        disabled={disabled}
                    >
                        {b.emoji} {b.label}
                    </button>
                ))}
            </div>

            {/* Товары */}
            {selectedBrand && (
                <div className="cat-products-section">
                    <p className="cat-products-hint">
                        👇 Нажмите на товар — покажем адрес доставки перед переходом
                    </p>

                    {selectedBrand === 'Оба!' ? (
                        <>
                            <p className="cat-products-brand-label">🔵 Purina Pro Plan</p>
                            <ProductList
                                products={purinaProducts}
                                loading={loading}
                                error={error}
                            />
                            <p className="cat-products-brand-label" style={{ marginTop: '1.2rem' }}>
                                🟤 Grandorf
                            </p>
                            <ProductList
                                products={grandorfProducts}
                                loading={loading}
                                error={error}
                            />
                        </>
                    ) : (
                        <ProductList
                            products={selectedBrand === 'Purina Pro Plan' ? purinaProducts : grandorfProducts}
                            loading={loading}
                            error={error}
                        />
                    )}
                </div>
            )}
        </div>
    )
}