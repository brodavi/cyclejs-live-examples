import {Observable} from 'rx'
import isolate from '@cycle/isolate'

import {div, button, p, a} from '@cycle/dom'

function main (sources) {
  const action$ = Observable.merge(
    sources.DOM.select('.decrement')
      .events('click').map(ev => -1),
    sources.DOM.select('.increment')
      .events('click').map(ev => +1)
  )

  const count$ = action$.startWith(0).scan((x, y) => x + y)

  const countvdom$ = count$.map(count =>
    div([
      p([
        a({href: 'https://github.com/cyclejs/examples/tree/master/counter',
           style: {'font-size': '10px'}}, 'https://github.com/cyclejs/examples/tree/master/counter')
      ]),
      button('.increment', 'Increment'),
      button('.decrement', 'Decrement'),
      p('Count: ' + count)
    ])
  )

  return {
    DOM: countvdom$
  }
}

export default sources => isolate(main)(sources)
