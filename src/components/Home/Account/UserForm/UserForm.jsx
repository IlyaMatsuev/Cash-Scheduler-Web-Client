import React from 'react';
import {Button, Form} from 'semantic-ui-react';


const UserForm = ({user, errors, onUserChange, onUserUpdate}) => {
    return (
        <Form onSubmit={onUserUpdate}>
            <Form.Input icon="user" label="First Name" labelPosition="left" type="text" name="firstName"
                        value={user.firstName} error={errors.firstName} onChange={onUserChange}/>
            <Form.Input icon="user" label="Last Name" type="text" name="lastName"
                        value={user.lastName} error={errors.lastName} onChange={onUserChange}/>
            <Form.Input icon="mail" label="Email" type="text" disabled name="emailName"
                        value={user.email}/>
            <Form.Input icon="dollar" label="Balance" type="number" name="balance"
                        value={user.balance} error={errors.balance} onChange={onUserChange}/>
            <Button primary fluid>Save</Button>
        </Form>
    );
};

export default UserForm;
