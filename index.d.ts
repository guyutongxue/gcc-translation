export interface ReplaceOption {
    color: boolean;
    version: string;
};

export function replaceGccDiagnostics(val: string, options?: Partial<ReplaceOption>): string;