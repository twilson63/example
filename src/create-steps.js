const { Reader, Either } = require('crocks')
const { map, over, lensProp, cond, compose, equals, prop, identity } = require('ramda')
const { z } = require('zod')

const { of, Left, Right } = Either
const { ask, lift } = Reader

const schema = z.object({
  buttons: z.object({
    action: z.string(),
    text: z.string()
  }).array()
}).passthrough().array()

const validate = steps => {
  const { success, data, errors } = schema.safeParse(steps)
  return success ? Right(data) : Left(errors)
}

const actionIs = v => compose(equals(v), prop('action'))

const createButton = e => cond([
  [actionIs('next'), ({ text }) => ({ text, classes: e.classes.nextBtn, action: e.instance.next })],
  [actionIs('back'), ({ text }) => ({ text, classes: e.classes.backBtn, action: e.instance.back })],
  [actionIs('finish'), ({ text }) => ({ text, classes: e.classes.nextBtn, action: e.instance.finish })],
  [actionIs('skip'), ({ text }) => ({ text, classes: e.classes.nextBtn, action: e.instance.skip })]
])

const forEachStepCreateButtons = e => map(over(lensProp('buttons'), map(createButton(e))))

exports.createSteps = steps =>
  Reader.of(steps)
    .chain(steps => ask((e) =>
      of(steps)
        .chain(validate)
        .map(forEachStepCreateButtons(e))
        .either(
          () => [],
          identity
        )

    )
    )