// Файл теперь содержит только типы — данные живут в mokky.dev
export interface CatProduct {
    id: number
    brand: 'purina' | 'grandorf'
    name: string
    weight: string
    price: number
    oldPrice: number | null
    shop: 'ozon' | 'wb'
    url: string
    image: string
    rating: number
    reviews: number
    tag: string | null
    active: boolean
}