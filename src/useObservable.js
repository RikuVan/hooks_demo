import { useRef, useEffect } from "react"
import { Subject, queueScheduler } from "rxjs"
import { observeOn } from "rxjs/operators"

export function useObservable(epic, subscriber, inputs = []) {
  let inputs$Ref = useRef([])
  let subscriberRef = useRef(subscriber)

  useEffect(() => {
    subscriberRef.current = subscriber
  }, [subscriber])

  useEffect(() => {
    inputs.forEach(d => {
      const input$ = new Subject().pipe(observeOn(queueScheduler))
      inputs$Ref.current.push(input$)
    })
    const effect$ = epic(...inputs$Ref.current)
    const subscription = effect$.subscribe({
      next: x => subscriberRef.current.next(x),
      error: e => subscriberRef.current.error(e),
      complete: () => subscriberRef.current.complete()
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    inputs.forEach((d, i) => inputs$Ref.current[i].next(d))
    return () => {}
  }, inputs)
}
