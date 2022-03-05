const { test } = require('uvu')
const assert = require('uvu/assert')
const { createSteps } = require('./create-steps.js')

const steps = [
  {
    id: 'navbar',
    title: 'Navbar',
    text: 'This is your navbar',
    attachTo: { element: '.navbar', on: 'bottom' },
    cancelIcon: {
      enabled: true
    },
    buttons: [
      {
        action: 'skip',
        text: 'Skip'
      },
      {
        text: 'Next',
        action: 'next'
      }
    ]
  },
  {
    id: 'footer',
    title: 'Footer',
    text: 'This is the footer',
    attachTo: { element: '.footer', on: 'top' },
    cancelIcon: {
      enabled: true
    },
    buttons: [
      {
        text: 'Back',
        action: 'back',
      },
      {
        text: 'Finish',
        action: 'finish',
      }
    ]
  }
]

const noop = x => () => `${x} clicked`

const env = {
  classes: {
    backBtn: 'btn btn-sm btn-outline-primary',
    nextBtn: 'btn btn-sm btn-primary btn-next'
  },
  instance: { back: noop('Back'), skip: noop('Skip'), next: noop('Next'), finish: noop('Finish'), cancel: noop('Cancelled') }
}

test('ok', () => {
  const result = createSteps(steps).runWith(env)
  //console.log(JSON.stringify(result))
  // verify first button
  assert.is(result[0].buttons[0].text, 'Skip')
  assert.is(result[0].buttons[0].classes, 'btn btn-sm btn-primary btn-next')
  assert.is(result[0].buttons[0].action(), 'Skip clicked')
  // verify second button
  assert.is(result[0].buttons[1].text, 'Next')
  assert.is(result[0].buttons[1].classes, 'btn btn-sm btn-primary btn-next')
  assert.is(result[0].buttons[1].action(), 'Next clicked')

  // verify first button
  assert.is(result[1].buttons[0].text, 'Back')
  assert.is(result[1].buttons[0].classes, 'btn btn-sm btn-outline-primary')
  assert.is(result[1].buttons[0].action(), 'Back clicked')
  // verify second button
  assert.is(result[1].buttons[1].text, 'Finish')
  assert.is(result[1].buttons[1].classes, 'btn btn-sm btn-primary btn-next')
  assert.is(result[1].buttons[1].action(), 'Finish clicked')
})

test.run()