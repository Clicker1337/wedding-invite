import { useState, useEffect } from 'react'
import type {CatProduct} from '../data/catFood'

const CAT_API = 'https://17316ead6387d801.mokky.dev/cat-products'

interface UseCatProductsReturn {
    products: CatProduct[]
    loading: boolean
    error: string | null
    refetch: () => void
}

export function useCatProducts(): UseCatProductsReturn {
    const [products, setProducts] = useState<CatProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function fetchProducts() {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(CAT_API)
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Ошибка загрузки')
            // Показываем только активные товары
            setProducts((data as CatProduct[]).filter(p => p.active !== false))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return { products, loading, error, refetch: fetchProducts }
}