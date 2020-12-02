import React from 'react';
import {Grid, Header, Image, Item, Segment} from 'semantic-ui-react';
import styles from './CategoryList.module.css';


const CategoriesList = ({categories, transactionTypes, categoryType, onCategoryClick}) => {
    return (
        <Grid columns={2}>
            {transactionTypes && transactionTypes.data && transactionTypes.data.getTransactionTypes.map(type => (
                <Grid.Column key={type.typeName}>
                    <Header attached="top">{type.typeName}</Header>
                    <Segment attached loading={categories.loading || categories.error} className={styles.categoryListColumn}>
                        <Item.Group divided>
                            {(categories && categories.data
                                && categories.data[categoryType]
                                    .filter(category => category.transactionTypeName === type.typeName).map(category => (
                                        <Item key={category.id}>
                                            <Item.Content>
                                                <Image className={styles.categoryIcon} avatar={true}
                                                       src={category.iconUrl} onClick={() => onCategoryClick(category)}/>
                                                <Item.Description as="a" onClick={() => onCategoryClick(category)}>
                                                    {category.name}
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    ))) || []}
                        </Item.Group>
                    </Segment>
                </Grid.Column>
            ))}
        </Grid>
    );
};

export default CategoriesList;
