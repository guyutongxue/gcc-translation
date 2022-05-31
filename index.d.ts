export interface ReplaceOption {
    color: boolean;
    version: string;
};

export async function replaceGccDiagnostics(val: string, options?: Partial<ReplaceOption>): Promise<string>;