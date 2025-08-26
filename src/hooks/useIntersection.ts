import { useEffect, useRef, useState, useCallback } from 'react'

export function useIntersection(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((element: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (element) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting)
        },
        options
      )
      observerRef.current.observe(element)
    }
  }, [options])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return [ref, isIntersecting]
}
