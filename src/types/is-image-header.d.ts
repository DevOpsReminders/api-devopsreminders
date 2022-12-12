declare module 'is-image-header' {
    function isImage(url: string): Promise<boolean>;
    export = isImage;
}
