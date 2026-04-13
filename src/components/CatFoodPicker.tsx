import type {CatProduct} from '../data/catFood'
import { useCatProducts } from '../hooks/useCatProducts'
import { useShopConfirm } from '../hooks/useShopConfirm'
import ShopConfirmPortal from './ShopConfirmPortal'

// const ADDRESS = 'проспект Строителей, 2'

// ==================== КАРТОЧКА ====================
function ProductCard({
                         product,
                         onCardClick,
                     }: {
    product: CatProduct
    onCardClick: (p: CatProduct) => void
}) {
    const isOzon = product.shop === 'ozon'
    const shopLabel = isOzon ? 'Ozon' : 'Wildberries'
    const shopColor = isOzon ? '#005bff' : '#cb11ab'
    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null

    return (
        <div
            className="cat-product-card"
            onClick={() => onCardClick(product)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onCardClick(product)}
        >
            {product.tag && (
                <span className="cat-product-tag">{product.tag}</span>
            )}
            {discount && (
                <span className="cat-product-discount">−{discount}%</span>
            )}

            <div className="cat-product-image-wrap">
                <img
                    src={product.image}
                    alt={product.name}
                    className="cat-product-image"
                    loading="lazy"
                    onError={e => {
                        e.currentTarget.style.display = 'none'
                        const fb = e.currentTarget.nextElementSibling as HTMLElement
                        if (fb) fb.classList.remove('hidden')
                    }}
                />
                <span className="cat-product-image-fallback hidden">🐱</span>
            </div>

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
        </div>
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

// ==================== СПИСОК ====================
function ProductList({
                         products,
                         loading,
                         error,
                         onCardClick,
                     }: {
    products: CatProduct[]
    loading: boolean
    error: string | null
    onCardClick: (p: CatProduct) => void
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
                <ProductCard key={p.id} product={p} onCardClick={onCardClick} />
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

export default function CatFoodPicker({
                                          selectedBrand,
                                          onBrandSelect,
                                          disabled,
                                      }: Props) {
    const { products, loading, error } = useCatProducts()
    const { activeProduct, copied, open, close, copy } = useShopConfirm()

    const brands = [
        { id: 'Purina Pro Plan', label: 'Purina Pro Plan', emoji: '🔵' },
        { id: 'Grandorf', label: 'Grandorf', emoji: '🟤' },
        { id: 'Оба!', label: 'Оба варианта', emoji: '🎉' },
    ]

    const purinaProducts = products.filter(p => p.brand === 'purina')
    const grandorfProducts = products.filter(p => p.brand === 'grandorf')

    return (
        <>
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
                                    onCardClick={open}
                                />
                                <p className="cat-products-brand-label" style={{ marginTop: '1.2rem' }}>
                                    🟤 Grandorf
                                </p>
                                <ProductList
                                    products={grandorfProducts}
                                    loading={loading}
                                    error={error}
                                    onCardClick={open}
                                />
                            </>
                        ) : (
                            <ProductList
                                products={
                                    selectedBrand === 'Purina Pro Plan'
                                        ? purinaProducts
                                        : grandorfProducts
                                }
                                loading={loading}
                                error={error}
                                onCardClick={open}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Портал — рендерится прямо в document.body */}
            {activeProduct && (
                <ShopConfirmPortal
                    product={activeProduct}
                    onClose={close}
                    copied={copied}
                    onCopy={copy}
                />
            )}
        </>
    )
}