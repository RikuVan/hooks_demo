import { useEffect, useState, useRef } from "react"

export function useApi(fetchImages, fetchBreeds) {
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const [breedData, setBreeds] = useState({ breeds: [], letters: [] })
  const [imagesIndex, setIndex] = useState(0)
  let cancellation = useRef(null)

  const getImages = ids =>
    fetchImages(ids).fork(
      // rejection branch
      err => {
        console.log(err)
        setLoading(false)
        cancellation.current = null
      },
      // success branch
      res => {
        setImages(res)
        setLoading(false)
        cancellation.current = null
      }
    )

  useEffect(() => {
    fetchBreeds.fork(
      err => {
        setLoading(false)
        console.log(err)
      },
      data => {
        setLoading(false)
        setBreeds({ breeds: data.breeds, letters: data.letters })
        getImages(data.breeds[0])
      }
    )
  }, [])

  useEffect(() => {
    if (cancellation.current) {
      cancellation.current()
    }
    setLoading(true)
    const ids = breedData.breeds[imagesIndex]
    if (ids && ids.length) {
      const cancel = getImages(ids)
      cancellation.current = cancel
    }
  }, [imagesIndex])

  const incIndex = () => {
    if (imagesIndex < breedData.letters.length - 1) {
      setIndex(imagesIndex + 1)
    } else {
      setIndex(0)
    }
  }

  const decIndex = () => {
    if (imagesIndex > 0) {
      setIndex(imagesIndex - 1)
    }
  }
  return { ...breedData, imagesIndex, setIndex, incIndex, decIndex, loading, images }
}
