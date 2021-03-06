import {Observable, Subject} from 'rx'
import isolate from '@cycle/isolate'
import Item from './Item'

import {button, div, p, a} from '@cycle/dom'

function intent (DOM, itemActions) {
  const addItem$ = Observable.merge(
    DOM.select('.add-one-btn').events('click').map(() => 1),
    DOM.select('.add-many-btn').events('click').map(() => 1000)
  )
  const removeItem$ = itemActions.destroy$

  return {
    addItem$,
    removeItem$
  }
}

function model (actions, itemFn) {
  function createRandomItemProps () {
    let hexColor = Math.floor(Math.random() * 16777215).toString(16)
    while (hexColor.length < 6) {
      hexColor = '0' + hexColor
    }
    hexColor = '#' + hexColor
    const randomWidth = Math.floor(Math.random() * 800 + 200)
    return {color: hexColor, width: randomWidth}
  }

  let mutableLastId = 0

  function createNewItem (props) {
    const id = mutableLastId++
    const sinks = itemFn(props, id)
    sinks.DOM = sinks.DOM.replay(null, 1)
    sinks.DOM.connect()
    sinks.destroy$ = sinks.destroy$.publish()
    sinks.destroy$.connect()
    return {id, DOM: sinks.DOM, destroy$: sinks.destroy$}
  }

  const initialState = [createNewItem({color: 'red', width: 300})]

  const addItemMod$ = actions.addItem$.map(amount => {
    let newItems = []
    for (let i = 0; i < amount; i++) {
      newItems.push(createNewItem(createRandomItemProps()))
    }
    return function (listItems) {
      return listItems.concat(newItems)
    }
  })

  const removeItemMod$ = actions.removeItem$.map(id =>
    function (listItems) {
      return listItems.filter(item => item.id !== id)
    }
  )

  return Observable.merge(addItemMod$, removeItemMod$)
    .startWith(initialState)
    .scan((listItems, modification) => modification(listItems))
    .publishValue(initialState).refCount()
}

function view (itemDOMs$) {
  function renderTopButtons () {
    return div('.topButtons', [
      p([
        a({href: 'https://github.com/cyclejs/examples/tree/master/many',
           style: {'font-size': '10px'}}, 'https://github.com/cyclejs/examples/tree/master/many')
      ]),
      button('.add-one-btn', 'Add New Item'),
      button('.add-many-btn', 'Add Many Items')
    ])
  }

  return itemDOMs$.map(itemDOMs =>
    div('.list',
      [renderTopButtons()].concat(itemDOMs)
    )
  )
}

function makeItemWrapper (DOM) {
  return function itemWrapper (props, id) {
    const propsObservables = {
      color$: Observable.just(props.color),
      width$: Observable.just(props.width)
    }
    const item = Item({DOM, props: propsObservables})
    return {
      DOM: item.DOM,
      destroy$: item.destroy$.map(() => id)
    }
  }
}

function main (sources) {
  const itemActions = {destroy$: new Subject()}
  const actions = intent(sources.DOM, itemActions)
  const itemWrapper = makeItemWrapper(sources.DOM)
  const items$ = model(actions, itemWrapper)
  const itemDOMs$ = items$.map(items => items.map(item => item.DOM))
  const itemDestroy$ = items$
    .filter(items => items.length)
    .flatMapLatest(items =>
      Observable.merge(items.map(item => item.destroy$))
    )
  itemDestroy$.subscribe(itemActions.destroy$.asObserver())
  const vtree$ = view(itemDOMs$)

  return {
    DOM: vtree$
  }
}

export default sources => isolate(main)(sources)
