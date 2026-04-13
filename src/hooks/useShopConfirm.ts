import { useState, useCallback } from 'react'
import type {CatProduct} from '../data/catFood'

export function useShopConfirm() {
    const [activeProduct, setActiveProduct] = useState<CatProduct | null>(null)
    const [copied, setCopied] = useState(false)

    const open = useCallback((product: CatProduct) => {
        setActiveProduct(product)
        setCopied(false)
    }, [])

    const close = useCallback(() => {
        setActiveProduct(null)
        setCopied(false)
    }, [])

    const copy = useCallback(() => {
        navigator.clipboard.writeText('проспект Строителей, 2').then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        })
    }, [])

    return { activeProduct, copied, open, close, copy }
}