import {forwardRef} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Poly from '@s-ui/react-primitive-polymorphic-element'
import {inject, combineProps} from '@s-ui/react-primitive-injector'

import AccordionItemHeaderChildrenDefault from './AccordionItemHeaderChildrenDefault.js'
import {useAccordionContext} from './context/index.js'

import {
  BASE_CLASS_ITEM_HEADER,
  getBehavior,
  getIcon,
  HEADER_ICON_POSITION
} from './settings.js'

const AccordionItemHeader = forwardRef(
  (
    {
      as = 'h1',
      id,
      panelId,
      icon: iconProp,
      iconPosition: iconPositionProp,
      children = <AccordionItemHeaderChildrenDefault />,
      animationDuration: animationDurationProp,
      value,
      label,
      level,
      disabled,
      onClick
    },
    forwardedRef
  ) => {
    const {
      values,
      onChange,
      behavior,
      setValues,
      headerIconExpanded: iconExpandedContext,
      headerIconCollapsed: iconCollapsedContext,
      headerIconPosition: iconPositionContext,
      animationDuration: animationDurationContext
    } = useAccordionContext({value})

    const handleClick = event => {
      const response = getBehavior(behavior)({value, values})
      setValues(response.values)
      ;[onChange, onClick].forEach(onHandler => {
        typeof onHandler === 'function' && onHandler(event, response)
      })
    }

    const isExpanded = values.includes(value)
    const icon = getIcon(
      {icon: iconProp, isExpanded},
      {iconExpanded: iconExpandedContext, iconCollapsed: iconCollapsedContext}
    )
    const iconPosition = iconPositionProp || iconPositionContext
    const animationDuration = animationDurationProp || animationDurationContext
    const isHeadingElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(as)
    return (
      <Poly
        as={as}
        ref={forwardedRef}
        className={BASE_CLASS_ITEM_HEADER}
        {...{
          ...(!isHeadingElement && {role: 'heading'}),
          ...(!isHeadingElement && level && {'aria-level': level})
        }}
      >
        <button
          type="button"
          id={id}
          className={cx(
            `${BASE_CLASS_ITEM_HEADER}Button`,
            `${BASE_CLASS_ITEM_HEADER}Button--icon-position-${iconPosition}`
          )}
          aria-pressed={isExpanded}
          aria-controls={panelId}
          {...{
            ...(disabled && {'aria-disabled': disabled, disabled}),
            ...(label && {'aria-label': label})
          }}
          onClick={handleClick}
        >
          {inject(children, [
            {
              props: {
                ...(label && {children: label}),
                disabled,
                icon,
                iconPosition,
                values,
                value,
                animationDuration
              },
              proviso: () => true,
              combine: combineProps
            }
          ])}
        </button>
      </Poly>
    )
  }
)

AccordionItemHeader.displayName = 'AccordionItemHeader'

AccordionItemHeader.propTypes = {
  /** The elementType of the wrapper **/
  as: PropTypes.elementType,
  /** The animation duration in ms **/
  animationDuration: PropTypes.number,
  /** child element **/
  children: PropTypes.node,
  /** element enabled or not **/
  disabled: PropTypes.bool,
  /** unique identifier **/
  id: PropTypes.string,
  /** unique identifier of the controlled panel **/
  panelId: PropTypes.string,
  /** The header Icn element **/
  icon: PropTypes.node,
  /** where the icon is header positioned */
  iconPosition: PropTypes.oneOf(Object.values(HEADER_ICON_POSITION)),
  /** appropriate for the information architecture of the page **/
  label: PropTypes.string.isRequired,
  /** the unique value of the element **/
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** the heading level **/
  level: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', 1, 2, 3, 4, 5, 6]),
  /** header clicking handler **/
  onClick: PropTypes.func
}

export default AccordionItemHeader
