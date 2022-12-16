import { promises as fs } from 'fs';

const fileExists = async (path: string) => !!(await fs.stat(path).catch(() => false));

export default fileExists;
