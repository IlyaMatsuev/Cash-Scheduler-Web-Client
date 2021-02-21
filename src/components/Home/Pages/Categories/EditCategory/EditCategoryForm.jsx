import React from 'react';
import {Dropdown, Grid, Input} from 'semantic-ui-react';
import ErrorsList from '../../../../../utils/ErrorsList/ErrorsList';
import {server} from '../../../../../config';

const EditCategoryForm = ({category, transactionTypes, errors, onChange}) => {
    return (
        <Grid padded centered>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Input type="text" name="name" placeholder="Name" disabled={!category.isCustom}
                           error={!!errors.name} value={category.name} onChange={onChange}/>
                </Grid.Column>
                <Grid.Column>
                    <Dropdown disabled fluid name="transactionTypeName" placeholder="Type" selection
                              loading={transactionTypes.loading || transactionTypes.error}
                              error={!!errors.transactionTypeName} value={category.type.name}
                              options={
                                  (transactionTypes && transactionTypes.data
                                      && transactionTypes.data.transactionTypes.map(type => ({
                                          key: type.name,
                                          text: type.name,
                                          value: type.name,
                                          image: {avatar: true, src: `${server.root}${type.iconUrl}`}
                                      }))) || []
                              }/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Input fluid name="iconUrl" type="text" placeholder="Icon Url" disabled={!category.isCustom}
                                error={!!errors.iconUrl} value={category.iconUrl} onChange={onChange}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    );
};

export default EditCategoryForm;
