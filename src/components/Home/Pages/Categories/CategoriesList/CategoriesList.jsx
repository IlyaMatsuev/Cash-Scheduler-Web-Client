import React from 'react';
import {Grid, Header, Image, Item, Segment} from 'semantic-ui-react';
import styles from './CategoryList.module.css';
import {convertToValidIconUrl} from '../../../../../utils/UtilHooks';


const CategoriesList = ({categories, transactionTypes, categoryType, onCategoryClick}) => {
    return (
        <Grid columns={2}>
            {transactionTypes && transactionTypes.data && transactionTypes.data.transactionTypes.map(type => (
                <Grid.Column key={type.name}>
                    <Header attached="top">{type.name}</Header>
                    <Segment attached loading={categories.loading || categories.error} className={styles.categoryListColumn}>
                        <Item.Group divided>
                            {(categories && categories.data
                                && categories.data[categoryType]
                                    .filter(category => category.type.name === type.name).map(category => (
                                        <Item key={category.id}>
                                            <Item.Content>
                                                <Image className={styles.categoryIcon} avatar={true}
                                                       src={convertToValidIconUrl(category.iconUrl)}
                                                       onClick={() => onCategoryClick(category)}/>
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
