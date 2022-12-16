import fixtures from '@testHelpers/fixtures';

const fakeMailTemplatetor = async (fileName: string, replacements: Record<string, string>): Promise<string> => {
    let tpl = await fixtures.getEmailTemplate(fileName);
    Object.keys(replacements).forEach(replacementKey => {
        tpl = tpl.split(`<%= ${replacementKey} %>`).join(replacements[replacementKey]);
    });
    return tpl;
};

export default fakeMailTemplatetor;
