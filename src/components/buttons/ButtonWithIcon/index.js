import React from 'react'
import { Button, Icon } from '@ui-kitten/components'
import PropTypes from 'prop-types'

const renderIcon = ({ name, style }) => (
    <Icon {...style} name={name} />
)

const ButtonWithIcon = ({
    accessibilityRole,
    accessibilityLabel,
    icon,
    iconStyle,
    onPress,
    text,
    style
}) => {
    const ButtonIcon = () => renderIcon({ name: icon, style: iconStyle })
    return (
        <Button
            style={style}
            icon={ButtonIcon}
            onPress={onPress}
            accessibilityRole={accessibilityRole}
            accessibilityLabel={accessibilityLabel}
        >
            {text}
        </Button>
    )
}

ButtonWithIcon.propTypes = {
    accessibilityRole: PropTypes.object.isRequired,
    accessibilityLabel: PropTypes.object.isRequired,
    icon: PropTypes.object.isRequired,
    iconStyle: PropTypes.object.isRequired,
    onPress: PropTypes.object.isRequired,
    text: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired
}

export default ButtonWithIcon
