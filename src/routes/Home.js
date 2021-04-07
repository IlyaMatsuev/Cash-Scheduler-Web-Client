import React from 'react';
import HomeWrapper from '../components/Home/HomeWrapper/HomeWrapper';
import {useQuery} from '@apollo/client';
import settingQueries from '../graphql/queries/settings';
import {getSetting} from '../utils/SettingUtils';
import {setTheme} from '../utils/GlobalUtils';


const Home = () => {
    const {data: settingsQueryData} = useQuery(settingQueries.GET_SETTINGS);
    if (getSetting('DarkTheme', settingsQueryData)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    return <HomeWrapper/>;
};

export default Home;
