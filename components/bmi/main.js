import {Observable} from 'rx'
import isolate from '@cycle/isolate'
import LabeledSlider from './slider.js'

import {div, p, a, h2} from '@cycle/dom'

function main (sources) {
  const weightProps$ = Observable.of({
    label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 150
  })

  const heightProps$ = Observable.of({
    label: 'Height', unit: 'cm', min: 140, initial: 170, max: 210
  })

  const weightSources = {DOM: sources.DOM, props$: weightProps$}
  const heightSources = {DOM: sources.DOM, props$: heightProps$}
  const weightSlider = LabeledSlider(weightSources)
  const heightSlider = LabeledSlider(heightSources)
  const weightVTree$ = weightSlider.DOM
  const weightValue$ = weightSlider.value$
  const heightVTree$ = heightSlider.DOM
  const heightValue$ = heightSlider.value$

  const bmi$ = Observable.combineLatest(weightValue$, heightValue$,
   (weight, height) => {
     const heightMeters = height * 0.01
     const bmi = Math.round(weight / (heightMeters * heightMeters))
     return bmi
   }
  )

  return {
    DOM: bmi$.combineLatest(weightVTree$, heightVTree$,
      (bmi, weightVTree, heightVTree) =>
        div([
          p([
            a({href: 'https://github.com/cyclejs/examples/tree/master/bmi-nested',
               style: {'font-size': '10px'}}, 'https://github.com/cyclejs/examples/tree/master/bmi-nested')
          ]),
          weightVTree,
          heightVTree,
          h2('BMI is ' + bmi)
        ])
    )
  }
}

export default sources => isolate(main)(sources)
