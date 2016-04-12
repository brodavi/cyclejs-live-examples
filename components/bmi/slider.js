import {Observable} from 'rx'
import isolate from '@cycle/isolate'

import {input, div, span} from '@cycle/dom'

function main (sources) {
  const initialValue$ = sources.props$
    .map(props => props.initial)
    .first()

  const newValue$ = sources.DOM
    .select('.slider')
    .events('input')
    .map(ev => ev.target.value)

  const value$ = initialValue$.concat(newValue$)

  const vtree$ = Observable.combineLatest(sources.props$, value$,
    (props, value) =>
      div('.labeled-slider', [
        span('.label',
          props.label + ' ' + value + props.unit
        ),
        input('.slider', {
          type: 'range', min: props.min, max: props.max, value
        })
      ])
  )

  const sinks = {
    DOM: vtree$,
    value$
  }
  return sinks
}

export default sources => isolate(main)(sources)
