import React from 'react';
import {Icon, Menu} from 'semantic-ui-react';


const MenuItem = ({name, iconName, onMenuItemSelected}) => {
    return (
        <Menu.Item as="a" className="text-center text-capitalize" name={name} onClick={onMenuItemSelected}>
            {name}
            <Icon name={iconName}/>
        </Menu.Item>
    );
};

export default MenuItem;
