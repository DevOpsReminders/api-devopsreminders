import ejs, { AsyncTemplateFunction, Options, TemplateFunction } from 'ejs';
import fileExists from '@utils/fileExists';
import fs from 'fs/promises';
import { EmailConfig, EmailTemplateName } from '@config/modules/emailsConfig';
import appConfig from '@config/index';

type CompiledTemplate = AsyncTemplateFunction | TemplateFunction;
type TemplateExt = 'html' | 'txt';

export default class MailTemplateService {
    static instance?: MailTemplateService;

    config: EmailConfig;
    compiledTemplates: Map<string, CompiledTemplate | false> = new Map();

    compileOptions: Options = {
        async: true,
    };

    static getInstance(config?: EmailConfig): MailTemplateService {
        if (!this.instance || !!config) {
            this.instance = new MailTemplateService(config || appConfig.email);
        }

        return this.instance;
    }

    constructor(config: EmailConfig) {
        this.config = config;
    }

    protected templateFullPath(templateName: EmailTemplateName, type: TemplateExt) {
        return `${this.config.templatesPath}/${templateName}/${templateName}.${type}`;
    }

    public async templateExists(templateName: EmailTemplateName, type: TemplateExt) {
        return fileExists(this.templateFullPath(templateName, type));
    }

    protected async getTemplateSource(templateName: EmailTemplateName, type: TemplateExt): Promise<string> {
        const templatePath = this.templateFullPath(templateName, type);
        const source = await fs.readFile(templatePath, 'utf-8');
        return source.toString();
    }

    protected async compileTemplate(templateName: EmailTemplateName, type: TemplateExt) {
        if (!(await this.templateExists(templateName, type))) return false;
        const source = await this.getTemplateSource(templateName, type);
        return ejs.compile(source, this.compileOptions);
    }

    protected async getCompiledTemplate(
        templateName: EmailTemplateName,
        type: TemplateExt,
    ): Promise<CompiledTemplate | false> {
        let compiledTemplate: CompiledTemplate | false = false;
        const compiledMapKey = `${templateName}.${type}`;
        if (!this.compiledTemplates.has(compiledMapKey)) {
            compiledTemplate = await this.compileTemplate(templateName, type);
            this.compiledTemplates.set(compiledMapKey, compiledTemplate);
        } else {
            compiledTemplate = this.compiledTemplates.get(compiledMapKey) as CompiledTemplate | false;
        }

        return compiledTemplate;
    }

    public async templateWithReplacements(
        templateName: EmailTemplateName,
        type: TemplateExt,
        replacements: Record<string, string | number | Date>,
    ): Promise<string | false> {
        const compiled = await this.getCompiledTemplate(templateName, type);
        return compiled ? await compiled(replacements) : false;
    }

    public async templatesWithReplacements(
        templateName: EmailTemplateName,
        replacements: Record<string, string | number | Date>,
    ): Promise<{ text: string | undefined; html: string | undefined }> {
        const html = await this.templateWithReplacements(templateName, 'html', replacements);
        const text = await this.templateWithReplacements(templateName, 'txt', replacements);
        return {
            html: html || undefined,
            text: text || undefined,
        };
    }
}
