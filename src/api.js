import { useEffect, useState, useRef } from "react"
import * as F from "fluture"
import * as Sanctuary from "sanctuary"
const { env: flutureEnv } = require("fluture-sanctuary-types")
const checkTypes = process.env.NODE_ENV !== "production"
// Sanctuary provides awesome errors in development versus e.g. Ramda
export const S = Sanctuary.create({
  checkTypes,
  env: Sanctuary.env.concat(flutureEnv)
})

const API_ROOT = "https://dog.ceo/api"
const BREED_LIST_URL = `${API_ROOT}/breeds/list`
const getImagesUrlFor = breed => `${API_ROOT}/breed/${breed}/images`

// wrap promise library so it returns a future
const fuFetch = F.encaseP2(fetch)

const headers = {
  Accept: "application/json"
}

const get = url => fuFetch(url, { headers })

const getStringHead = S.ap(s => n => s.slice(0, n))(s => 1)

const groupByFirstLetter = S.groupBy(x => y => S.equals(getStringHead(x))(getStringHead(y)))

// [['alf', 'argh'],['bee', 'boo']] -> ['a', 'b']
const getEachFirstLetter = S.mapMaybe(S.pipe([S.map(getStringHead), S.head]))

const rand = items => items[~~(items.length * Math.random())]

// chain and map are like .next with a promise
// map is to transform the data f -> Future(f(d))
// chain allows you to, e.g. map to a new Future or another type, flattening the resulting nested Types

export const getBreeds = get(BREED_LIST_URL)
  .chain(res => F.tryP(() => res.json()))
  .map(S.prop("message"))
  //index our breeds by first letters - we trust already they come from the api alphabetized
  .map(groupByFirstLetter)
  //we need a list of the letters for our nav
  .map(breeds => ({ breeds, letters: getEachFirstLetter(breeds) }))

export const getImages = breed =>
  get(getImagesUrlFor(breed))
    .chain(res => F.tryP(() => res.json()))
    // we need to decide how we deal with api errors--we can short circuit into the reject branch with F.reject
    // but in this case we prefer just to ignore unsuccessful requests and display nothing by returning an empty array
    // use chain not map because we return a new Future -- with map we would end up with [Future(message), Future(message)]
    .chain(res => (res.status !== "success" ? F.of({ message: [] }) : F.of(res)))
    .map(S.prop("message"))

export const getImagesConcurrently = breeds =>
  // lets debounce so the Future the requests doesn't start as the user clicks through the letters
  F.after(500, null).chain(_ =>
    //The first argument is how many of the Futures you want to be concurrent
    F.parallel(Infinity, breeds.map(b => getImages(b)))
      //instead of loading hundreds of pics, we will just take one random example for each breed
      .map(S.ap([rand]))
      // rand will return undefined for empty arrays, so we need to filter these out in case we got an error up the chain in getImages
      .map(S.filter(v => !!v))
  )

export function useApi() {
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const [breedData, setBreeds] = useState({ breeds: [], letters: [] })
  const [imagesIndex, setIndex] = useState(0)
  const cancellation = useRef(null)

  const getImages = ids =>
    getImagesConcurrently(ids).fork(
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
    getBreeds.fork(
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
    }
  }

  const decIndex = () => {
    if (imagesIndex > 0) {
      setIndex(imagesIndex - 1)
    }
  }
  return { ...breedData, imagesIndex, setIndex, incIndex, decIndex, loading, images }
}
