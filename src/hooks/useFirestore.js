import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.js'

export function useCollection(collectionName, fallback = []) {
  const [data, setData]       = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, collectionName),
      snapshot => {
        setData(snapshot.docs.map(d => ({ ...d.data(), id: d.id })))
        setLoading(false)
      },
      err => { setError(err); setLoading(false) }
    )
    return unsub
  }, [collectionName])

  return { data, loading, error }
}
