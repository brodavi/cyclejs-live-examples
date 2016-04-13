import Rx from 'rx'
import {a, p, div} from '@cycle/dom'
import isolate from '@cycle/isolate'

import Gravatar from './components/gravatar/main.js'
import Calendar from './components/calendar/main.js'
import BMI from './components/bmi/main.js'
import Greeter from './components/greeter/main.js'
import Counter from './components/counter/main.js'
import GetRandomUser from './components/get-random-user/main.js'
import Many from './components/many/main.js'
import AnimatedLetters from './components/animated-letters/main.js'
import {createFolderComponent} from './components/nested-folders/main.js'
import Autocomplete from './components/autocomplete-search/main.js'

const BackspaceDisabler = require('backspace-disabler')
BackspaceDisabler.disable()

function main (sources) {
  const gru = GetRandomUser(sources)
  const autocomplete = Autocomplete(sources)

  const grav$ = Gravatar(sources).DOM
  const cal$ = Calendar(sources).DOM
  const greet$ = Greeter(sources).DOM
  const bmi$ = BMI(sources).DOM
  const count$ = Counter(sources).DOM
  const gru$ = gru.DOM
  const many$ = Many(sources).DOM
  const aletters$ = AnimatedLetters(sources).DOM
  const nfolders$ = createFolderComponent({id: 0, removable: false})(sources).DOM
  const autocomplete$ = autocomplete.DOM

  const connectionStatus$ = sources.Connection.startWith('online').map(function (c) {
    return div([
      p([
        a({href: 'https://github.com/jmeas/cycle-connection-driver',
           style: {'font-size': '10px'}}, 'https://github.com/jmeas/cycle-connection-driver')
      ]),
      c
    ])
  })

  const divStyle = {
    border: '1px solid black',
    padding: '10px',
    margin: '10px'
  }

  const vtree$ = Rx.Observable.combineLatest(
    connectionStatus$,
    grav$,
    cal$,
    greet$,
    bmi$,
    count$,
    gru$,
    many$,
    aletters$,
    nfolders$,
    autocomplete$,

    (vd1, ...rest) => {
      return div([[vd1, ...rest].map(function (s) {
        return div({style: divStyle}, s)
      })])
    }
  )

  return {
    DOM: vtree$,
    HTTP: gru.HTTP,
    preventDefault: autocomplete.preventDefault,
    JSONP: autocomplete.JSONP
  }
}

export default sources => isolate(main)(sources)
