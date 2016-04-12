import isolate from '@cycle/isolate'

import {a, p, div, label, input, h1} from '@cycle/dom'

function main (sources) {
  const inputEv$ = sources.DOM.select('.field').events('input')
  const name$ = inputEv$.map(ev => ev.target.value).startWith('')
  const greetvdom$ = name$.map(name =>
    div([
      p([
        a({href: 'https://github.com/cyclejs/examples/tree/master/hello-world',
           style: {'font-size': '10px'}}, 'https://github.com/cyclejs/examples/tree/master/hello-world')
      ]),
      label('Name: '),
      input('.field', {type: 'text'}),
      h1(`Hello ${name}!`)
    ])
  )
  return {
    DOM: greetvdom$
  }
}

export default sources => isolate(main)(sources)
