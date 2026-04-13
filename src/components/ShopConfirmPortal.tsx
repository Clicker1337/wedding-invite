import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type {CatProduct} from '../data/catFood'

const ADDRESS = 'проспект Строителей, 2'

interface ShopConfirmPortalProps {
    product: CatProduct
    onClose: () => void
    copied: boolean
    onCopy: () => void
}

export default function ShopConfirmPortal({
                                              product,
                                              onClose,
                                              copied,
                                              onCopy,
                                          }: ShopConfirmPortalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    const isOzon = product.shop === 'ozon'
    const shopLabel = isOzon ? 'Ozon' : 'Wildberries'
    const shopColor = isOzon ? '#005bff' : '#cb11ab'
    const shopBg = isOzon ? '#f0f4ff' : '#fdf0fb'

    // Закрытие по Escape
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKeyDown)
        // Блокируем скролл body
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
        }
    }, [onClose])

    // Закрытие по клику на оверлей
    function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === overlayRef.current) onClose()
    }

    function handleGoToShop() {
        window.open(product.url, '_blank', 'noopener,noreferrer')
        onClose()
    }

    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null

    return createPortal(
        <div
            ref={overlayRef}
            className="scp-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label="Подтверждение перехода в магазин"
        >
            <div className="scp-modal">

                {/* Кнопка закрытия */}
                <button
                    className="scp-close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ✕
                </button>

                {/* Шапка */}
                <div className="scp-header">
                    <span className="scp-cat-emoji">🐱</span>
                    <h3 className="scp-title">Не забудь адрес!</h3>
                    <p className="scp-subtitle">
                        Укажи его при оформлении заказа
                    </p>
                </div>

                {/* Превью товара */}
                <div className="scp-product">
                    <div className="scp-product-img-wrap">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="scp-product-img"
                            onError={e => {
                                e.currentTarget.style.display = 'none'
                                const fb = e.currentTarget.nextElementSibling as HTMLElement
                                if (fb) fb.classList.remove('hidden')
                            }}
                        />
                        <span className="hidden" style={{ fontSize: '2rem' }}>🐱</span>
                    </div>

                    <div className="scp-product-info">
                        <p className="scp-product-name">{product.name}</p>
                        <p className="scp-product-weight">{product.weight}</p>
                        <div className="scp-product-price-row">
              <span className="scp-product-price">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
                            {product.oldPrice && (
                                <span className="scp-product-old-price">
                  {product.oldPrice.toLocaleString('ru-RU')} ₽
                </span>
                            )}
                            {discount && (
                                <span className="scp-product-discount">−{discount}%</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Адрес */}
                <div className="scp-address-block">
                    <div className="scp-address-icon-wrap">
                        <span className="scp-address-icon">📍</span>
                    </div>
                    <div className="scp-address-text">
                        <p className="scp-address-label">Адрес доставки котику</p>
                        <p className="scp-address-value">{ADDRESS}</p>
                    </div>
                </div>

                {/* Кнопка копирования */}
                <button
                    className={`scp-copy-btn ${copied ? 'scp-copy-btn--copied' : ''}`}
                    onClick={onCopy}
                >
                    {copied ? (
                        <>
                            <span className="scp-copy-icon">✅</span>
                            Адрес скопирован!
                        </>
                    ) : (
                        <>
                            <span className="scp-copy-icon">📋</span>
                            Скопировать адрес
                        </>
                    )}
                </button>

                {copied && (
                    <p className="scp-copy-hint">
                        Вставьте адрес в поле доставки на {shopLabel}
                    </p>
                )}

                {/* Кнопки */}
                <div className="scp-actions">
                    <button className="scp-btn-cancel" onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className="scp-btn-go"
                        style={{ background: shopColor, boxShadow: `0 4px 16px ${shopColor}40` }}
                        onClick={handleGoToShop}
                    >
            <span
                className="scp-shop-badge"
                style={{ background: shopBg, color: shopColor }}
            >
              {shopLabel}
            </span>
                        Перейти →
                    </button>
                </div>

            </div>
        </div>,
        document.body
    )
}