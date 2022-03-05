//from ./Tour/index.js

import { Fragment, useContext } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card, CardBody } from 'reactstrap'
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd'

import 'shepherd.js/dist/css/shepherd.css'
import '@styles/react/libs/shepherd-tour/shepherd-tour.scss'

const backBtnClass = 'btn btn-sm btn-outline-primary',
  nextBtnClass = 'btn btn-sm btn-primary btn-next'

let instance = null

const TourWrapper = ({ children }) => {
  const tour = useContext(ShepherdTourContext)
  instance = tour
  return (
    <div className='tour-button' onClick={() => tour.start()}>
      {children}
    </div>
  )
}

const createSteps = (steps) => {
  return steps.map((step) => {
    const newbuttons = step.buttons.map((button) => {
      switch (button.action) {
        case 'next': return {
          text: button.text,
          classes: nextBtnClass,
          action: () => instance.next()
        }
        case 'back': return {
          text: button.text,
          classes: backBtnClass,
          action: () => instance.back()
        }
        case 'skip': return {
          text: button.text,
          classes: backBtnClass,
          action: () => instance.cancel()
        }
        case 'finish': return {
          text: button.text,
          classes: nextBtnClass,
          action: () => instance.cancel()
        }
      }
    })
    return { ...step, buttons: newbuttons }
  })
}

const Tour = ({ steps, children }) => {

  return (
    <Fragment>
      <Row id='tour'>
        <Col xs={12}>
          <Card>
            <CardBody>
              <ShepherdTour
                steps={createSteps(steps)}
                tourOptions={{
                  useModalOverlay: true
                }}
              >
                <TourWrapper children={children} />
              </ShepherdTour>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

Tour.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    attachTo: PropTypes.shape({
      element: PropTypes.string.isRequired,
      on: PropTypes.string.isRequired
    }).isRequired,
    cancelIcon: PropTypes.shape({
      enabled: PropTypes.bool
    }),
    buttons: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.oneOf(['next', 'back', 'skip', 'finish']).isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
    )
  })),
  children: PropTypes.element.isRequired
}

export default Tour