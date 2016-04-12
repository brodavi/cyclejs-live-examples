import Rx from 'rx'
import Cycle from '@cycle/core'
import {makeHTTPDriver} from '@cycle/http'
import {makeJSONPDriver} from '@cycle/jsonp'
import {makeDOMDriver} from '@cycle/dom'
import cycleConnectionDriver from './components/cycle-connection-driver/main.js'

import App from './main.js'

function main (sources) {
  const app$ = App(sources).DOM
  return {
    DOM: app$
  }
}

function preventDefaultSinkDriver (prevented$) {
  prevented$.subscribe(ev => {
    ev.preventDefault()
    if (ev.type === 'blur') {
      ev.target.focus()
    }
  })
  return Rx.Observable.empty()
}

const drivers = {
  Keydown: () => Rx.Observable.fromEvent(document, 'keydown'),
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  JSONP: makeJSONPDriver(),
  preventDefault: preventDefaultSinkDriver,
  Connection: cycleConnectionDriver
}

Cycle.run(main, drivers)
