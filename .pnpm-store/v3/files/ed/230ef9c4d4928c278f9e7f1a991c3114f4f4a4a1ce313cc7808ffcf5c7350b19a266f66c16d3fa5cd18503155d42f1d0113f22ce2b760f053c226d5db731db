import { GitHubAdvisoryId } from 'audit-types';

interface NSPContent {
    readonly active?: boolean;
    readonly notes?: string;
    readonly expiry?: string | number;
}
type NSPRecord = Record<string, NSPContent>;
type GitHubNSPRecord = Record<GitHubAdvisoryId, NSPContent>;

type AllowlistRecord = string | NSPRecord;
declare class Allowlist {
    modules: string[];
    advisories: GitHubAdvisoryId[];
    paths: string[];
    moduleRecords: NSPRecord[];
    advisoryRecords: GitHubNSPRecord[];
    pathRecords: NSPRecord[];
    /**
     * @param input the allowlisted module names, advisories, and module paths
     */
    constructor(input?: AllowlistRecord[]);
    static mapConfigToAllowlist(config: Readonly<{
        allowlist: AllowlistRecord[];
    }>): Allowlist;
}

/**
 * Runs the audit-ci CLI.
 */
declare function runAuditCi(): Promise<void>;

type VulnerabilityLevels = {
    low: boolean;
    moderate: boolean;
    high: boolean;
    critical: boolean;
};
declare function mapVulnerabilityLevelInput({ low, l, moderate, m, high, h, critical, c, }: Record<string, boolean>): {
    [K in keyof VulnerabilityLevels]: VulnerabilityLevels[K];
};

/**
 * The output of `Yargs`'s `parse` function.
 * This is the type of the `argv` object.
 */
type AuditCiPreprocessedConfig = {
    /** Exit for low or above vulnerabilities */
    l: boolean;
    /** Exit for moderate or above vulnerabilities */
    m: boolean;
    /** Exit for high or above vulnerabilities */
    h: boolean;
    /** Exit for critical or above vulnerabilities */
    c: boolean;
    /** Exit for low or above vulnerabilities */
    low: boolean;
    /** Exit for moderate or above vulnerabilities */
    moderate: boolean;
    /** Exit for high or above vulnerabilities */
    high: boolean;
    /** Exit for critical vulnerabilities */
    critical: boolean;
    /** Package manager */
    p: "auto" | "npm" | "yarn" | "pnpm";
    /** Show a full audit report */
    r: boolean;
    /** Show a full audit report */
    report: boolean;
    /** Show a summary audit report */
    s: boolean;
    /** Show a summary audit report */
    summary: boolean;
    /** Package manager */
    "package-manager": "auto" | "npm" | "yarn" | "pnpm";
    a: string[];
    allowlist: AllowlistRecord[];
    /** The directory containing the package.json to audit */
    d: string;
    /** The directory containing the package.json to audit */
    directory: string;
    /** show allowlisted advisories that are not found. */
    "show-not-found": boolean;
    /** Show allowlisted advisories that are found */
    "show-found": boolean;
    /** the registry to resolve packages by name and version */
    registry?: string;
    /** The format of the output of audit-ci */
    o: "text" | "json";
    /** The format of the output of audit-ci */
    "output-format": "text" | "json";
    /** how the audit report is displayed. */
    "report-type": "full" | "important" | "summary";
    /** The number of attempts audit-ci calls an unavailable registry before failing */
    "retry-count": number;
    /** Pass if no audit is performed due to the registry returning ENOAUDIT */
    "pass-enoaudit": boolean;
    /** skip devDependencies */
    "skip-dev": boolean;
    /** extra positional args for underlying audit command */
    "extra-args": string[];
};
type ComplexConfig = Omit<AuditCiPreprocessedConfig, "allowlist" | "a" | "p" | "o" | "d" | "s" | "r" | "l" | "m" | "h" | "c" | "low" | "moderate" | "high" | "critical"> & {
    /** Package manager */
    "package-manager": "npm" | "yarn" | "pnpm";
    /** An object containing a list of modules, advisories, and module paths that should not break the build if their vulnerability is found. */
    allowlist: Allowlist;
    /** The vulnerability levels to fail on, if `moderate` is set `true`, `high` and `critical` should be as well. */
    levels: {
        [K in keyof VulnerabilityLevels]: VulnerabilityLevels[K];
    };
    /**
     * A path to npm, uses npm from `$PATH` if not specified
     * @internal
     */
    _npm?: string;
    /**
     * A path to pnpm, uses pnpm from `$PATH` if not specified
     * @internal
     */
    _pnpm?: string;
    /**
     * A path to yarn, uses yarn from `$PATH` if not specified
     * @internal
     */
    _yarn?: string;
};
type AuditCiFullConfig = {
    [K in keyof ComplexConfig]: ComplexConfig[K];
};
type AuditCiConfigComplex = Omit<Partial<AuditCiFullConfig>, "levels" | "allowlist"> & {
    allowlist?: AllowlistRecord[];
    low?: boolean;
    moderate?: boolean;
    high?: boolean;
    critical?: boolean;
};
type AuditCiConfig = {
    [K in keyof AuditCiConfigComplex]: AuditCiConfigComplex[K];
};

interface Summary {
    advisoriesFound: GitHubAdvisoryId[];
    failedLevelsFound: ("low" | "moderate" | "high" | "critical")[];
    allowlistedAdvisoriesNotFound: string[];
    allowlistedModulesNotFound: string[];
    allowlistedPathsNotFound: string[];
    allowlistedAdvisoriesFound: GitHubAdvisoryId[];
    allowlistedModulesFound: string[];
    allowlistedPathsFound: string[];
    advisoryPathsFound: string[];
}

type ReportConfig = Pick<AuditCiConfig, "show-found" | "show-not-found" | "output-format"> & {
    allowlist: Allowlist;
};
declare function reportAudit(summary: Summary, config: ReportConfig): Summary;
declare function isGitHubAdvisoryId(id: unknown): id is GitHubAdvisoryId;
declare function gitHubAdvisoryUrlToAdvisoryId(url: string): GitHubAdvisoryId;
declare function gitHubAdvisoryIdToUrl<T extends string>(id: T): `https://github.com/advisories/${T}`;

/**
 * Audit your NPM project!
 *
 * @returns Returns the audit report summary on resolve, `Error` on rejection.
 */
declare function audit$2(config: AuditCiConfig, reporter?: typeof reportAudit): Promise<Summary>;

/**
 * Run audit-ci with PNPM.
 */
declare function audit$1(config: AuditCiConfig, reporter?: typeof reportAudit): Promise<Summary>;

/**
 * Run audit-ci with Yarn Classic or Yarn Berry.
 */
declare function audit(config: AuditCiConfig, reporter?: typeof reportAudit): Promise<Summary>;

export { Allowlist, type AllowlistRecord, type AuditCiConfig, type ReportConfig, type Summary, type VulnerabilityLevels, gitHubAdvisoryIdToUrl, gitHubAdvisoryUrlToAdvisoryId, isGitHubAdvisoryId, mapVulnerabilityLevelInput, audit$2 as npmAudit, audit$1 as pnpmAudit, runAuditCi, audit as yarnAudit };
