import isolate from '@cycle/isolate'
import {div, p, a} from '@cycle/dom'
import {Observable} from 'rx'
import Calendar from './Calendar'

function main ({DOM}) {
  const calendarProps$ = Observable.of({
    year: 1998, month: 6
  })

  const calendar = Calendar({DOM, props$: calendarProps$})

  return {
    DOM: Observable.combineLatest(calendar.DOM, calendar.value$,
      (calendarVTree, value) => {
        return div([
          p([
            a({href: 'https://github.com/enten/cyclejs-calendar',
               style: {'font-size': '10px'}}, 'https://github.com/enten/cyclejs-calendar')
          ]),
          div(value ? value.toString() : 'Pick a date'),
          calendarVTree
        ])
      })
  }
}

export default (sources) => isolate(main)(sources)
