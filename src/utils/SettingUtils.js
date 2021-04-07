const asBoolean = value => value === 'true';

const getSetting = (name, settingsQueryData) => {
    if (settingsQueryData && settingsQueryData.settings) {
        return asBoolean(settingsQueryData.settings.find(s => s.setting.name === name)?.value);
    }
};

export {getSetting}
