import React from 'react';
import {Button, Container, Divider, Dropdown, Form, Grid} from 'semantic-ui-react';
import {server} from '../../../../../config';


const NewCategoryForm = ({category, query, errors, onCategoryChange, onCategoryCreate}) => {
    return (
        <Form onSubmit={onCategoryCreate}>
            <Container textAlign="center">
                <h3>New Category</h3>
            </Container>
            <Divider hidden/>
            <Grid columns={2} padded>
                <Grid.Column>
                    <Form.Input fluid name="name" placeholder="Name" type="text"
                                error={errors.name} value={category.name} onChange={onCategoryChange}/>
                </Grid.Column>
                <Grid.Column>
                    <Dropdown fluid name="transactionTypeName" placeholder="Type" selection
                              loading={query.loading || query.error}
                              error={errors.transactionTypeName} value={category.transactionTypeName}
                              onChange={onCategoryChange}
                              options={
                                  (query && query.data
                                      && query.data.transactionTypes.map(type => ({
                                          key: type.name,
                                          text: type.name,
                                          value: type.name,
                                          image: {
                                              avatar: true,
                                              src: `${server.root}${type.iconUrl}`
                                          }
                                      }))) || []
                              }/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Form.Input fluid name="iconUrl" type="text" placeholder="Icon Url"
                                error={errors.iconUrl} value={category.iconUrl} onChange={onCategoryChange}/>
                </Grid.Column>
            </Grid>
            <Container textAlign="center">
                <Button primary>Save</Button>
            </Container>
        </Form>
    );
};

export default NewCategoryForm;
