"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  Allowlist: () => allowlist_default,
  gitHubAdvisoryIdToUrl: () => gitHubAdvisoryIdToUrl,
  gitHubAdvisoryUrlToAdvisoryId: () => gitHubAdvisoryUrlToAdvisoryId,
  isGitHubAdvisoryId: () => isGitHubAdvisoryId,
  mapVulnerabilityLevelInput: () => mapVulnerabilityLevelInput,
  npmAudit: () => audit,
  pnpmAudit: () => audit2,
  runAuditCi: () => runAuditCi,
  yarnAudit: () => audit3
});
module.exports = __toCommonJS(lib_exports);

// lib/common.ts
var import_cross_spawn = require("cross-spawn");
var import_escape_string_regexp = __toESM(require("escape-string-regexp"), 1);
var import_event_stream = __toESM(require("event-stream"), 1);
var JSONStream = __toESM(require("jsonstream-next"), 1);
var import_readline_transform = __toESM(require("readline-transform"), 1);

// lib/colors.ts
var blue = "\x1B[36m%s\x1B[0m";
var green = "\x1B[32m%s\x1B[0m";
var red = "\x1B[31m%s\x1B[0m";
var yellow = "\x1B[33m%s\x1B[0m";

// lib/common.ts
function partition(a, fun) {
  const returnValue = { truthy: [], falsy: [] };
  for (const item of a) {
    if (fun(item)) {
      returnValue.truthy.push(item);
    } else {
      returnValue.falsy.push(item);
    }
  }
  return returnValue;
}
function reportAudit(summary, config) {
  const {
    allowlist,
    "show-not-found": showNotFound,
    "show-found": showFound,
    "output-format": outputFormat
  } = config;
  const {
    allowlistedModulesFound,
    allowlistedAdvisoriesFound,
    allowlistedModulesNotFound,
    allowlistedAdvisoriesNotFound,
    allowlistedPathsNotFound,
    failedLevelsFound,
    advisoriesFound,
    advisoryPathsFound
  } = summary;
  if (outputFormat === "text") {
    if (allowlist.modules.length > 0) {
      console.log(
        blue,
        `Modules to allowlist: ${allowlist.modules.join(", ")}.`
      );
    }
    if (showFound) {
      if (allowlistedModulesFound.length > 0) {
        const found = allowlistedModulesFound.join(", ");
        console.warn(yellow, `Found vulnerable allowlisted modules: ${found}.`);
      }
      if (allowlistedAdvisoriesFound.length > 0) {
        const found = allowlistedAdvisoriesFound.join(", ");
        console.warn(
          yellow,
          `Found vulnerable allowlisted advisories: ${found}.`
        );
      }
    }
    if (showNotFound) {
      if (allowlistedModulesNotFound.length > 0) {
        const found = allowlistedModulesNotFound.sort((a, b) => a.localeCompare(b)).join(", ");
        const allowlistMessage = allowlistedModulesNotFound.length === 1 ? `Consider not allowlisting module: ${found}.` : `Consider not allowlisting modules: ${found}.`;
        console.warn(yellow, allowlistMessage);
      }
      if (allowlistedAdvisoriesNotFound.length > 0) {
        const found = allowlistedAdvisoriesNotFound.sort((a, b) => a.localeCompare(b)).join(", ");
        const allowlistMessage = allowlistedAdvisoriesNotFound.length === 1 ? `Consider not allowlisting advisory: ${found}.` : `Consider not allowlisting advisories: ${found}.`;
        console.warn(yellow, allowlistMessage);
      }
      if (allowlistedPathsNotFound.length > 0) {
        const found = allowlistedPathsNotFound.sort((a, b) => a.localeCompare(b)).join(", ");
        const allowlistMessage = allowlistedPathsNotFound.length === 1 ? `Consider not allowlisting path: ${found}.` : `Consider not allowlisting paths: ${found}.`;
        console.warn(yellow, allowlistMessage);
      }
    }
    if (advisoryPathsFound.length > 0) {
      const found = advisoryPathsFound.join("\n");
      console.warn(yellow, `Found vulnerable advisory paths:`);
      console.log(found);
    }
  }
  if (failedLevelsFound.length > 0) {
    throw new Error(
      `Failed security audit due to ${failedLevelsFound.join(
        ", "
      )} vulnerabilities.
Vulnerable advisories are:
${advisoriesFound.map((element) => gitHubAdvisoryIdToUrl(element)).join("\n")}`
    );
  }
  return summary;
}
function hasMessage(value) {
  return typeof value === "object" && value != void 0 && "message" in value;
}
function hasStatusCode(value) {
  return typeof value === "object" && value != void 0 && "statusCode" in value;
}
function runProgram(command, arguments_, options, stdoutListener, stderrListener) {
  const transform = new import_readline_transform.default({ skipEmpty: true });
  const proc = (0, import_cross_spawn.spawn)(command, arguments_, options);
  let recentMessage;
  let errorMessage;
  proc.stdout.setEncoding("utf8");
  proc.stdout.pipe(
    transform.on("error", (error) => {
      throw error;
    })
  ).pipe(
    import_event_stream.default.mapSync((data) => {
      recentMessage = data;
      return data;
    })
  ).pipe(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error -- JSONStream.parse() accepts (pattern: any) when it should accept (pattern?: any)
    JSONStream.parse().on("error", () => {
      errorMessage = recentMessage;
      throw new Error(errorMessage);
    })
  ).pipe(
    import_event_stream.default.mapSync((data) => {
      if (!data)
        return;
      try {
        if (hasMessage(data) && typeof data.message === "string" && data.message.includes("ENOTFOUND")) {
          stderrListener(data.message);
          return;
        }
        if (hasStatusCode(data) && data.statusCode === 404) {
          stderrListener(data.message);
          return;
        }
        stdoutListener(data);
      } catch (error) {
        stderrListener(error);
      }
    })
  );
  return new Promise((resolve2, reject) => {
    proc.on("close", () => {
      if (errorMessage) {
        return reject(new Error(errorMessage));
      }
      return resolve2();
    });
    proc.on(
      "error",
      (error) => reject(errorMessage ? new Error(errorMessage) : error)
    );
  });
}
function wildcardToRegex(stringWithWildcard) {
  const regexString = stringWithWildcard.split(/\*+/).map((s) => (0, import_escape_string_regexp.default)(s)).join(".*");
  return new RegExp(`^${regexString}$`);
}
function matchString(template, string_) {
  return template.includes("*") ? wildcardToRegex(template).test(string_) : template === string_;
}
function isGitHubAdvisoryId(id) {
  return typeof id === "string" && id.startsWith("GHSA");
}
function gitHubAdvisoryUrlToAdvisoryId(url) {
  return url.split("/")[4];
}
function gitHubAdvisoryIdToUrl(id) {
  return `https://github.com/advisories/${id}`;
}

// lib/nsp-record.ts
function getAllowlistId(nspRecord) {
  return Object.keys(nspRecord)[0];
}
function getNSPContent(nspRecord) {
  const values = Object.values(nspRecord);
  if (values.length > 0) {
    return values[0];
  }
  throw new Error(
    `Empty NSPRecord is invalid. Here's an example of a valid NSPRecord:
{
  "allowlist": [
    {
      "vulnerable-module": {
        "active": true,
        "notes": "This is a note",
        "expiry": "2022-01-01"
      }
    }
  ]
}
    `
  );
}
function isNSPRecordActive(nspRecord, now = /* @__PURE__ */ new Date()) {
  const content = getNSPContent(nspRecord);
  if (!content.active) {
    return false;
  }
  if (content.expiry) {
    const expiryDate = new Date(content.expiry);
    if (expiryDate.getTime() > 0) {
      return now.getTime() < expiryDate.getTime();
    }
    return false;
  }
  return true;
}

// lib/allowlist.ts
var DEFAULT_NSP_CONTENT = {
  active: true,
  notes: void 0,
  expiry: void 0
};
function normalizeAllowlistRecord(recordOrId) {
  return typeof recordOrId === "string" ? {
    [recordOrId]: DEFAULT_NSP_CONTENT
  } : recordOrId;
}
function dedupeAllowlistRecords(recordsOrIds) {
  const map = /* @__PURE__ */ new Map();
  for (const recordOrId of recordsOrIds) {
    const nspRecord = normalizeAllowlistRecord(recordOrId);
    const advisoryId = getAllowlistId(nspRecord);
    if (!map.has(advisoryId)) {
      map.set(advisoryId, nspRecord);
    }
  }
  return [...map.values()];
}
var Allowlist = class _Allowlist {
  modules;
  advisories;
  paths;
  moduleRecords;
  advisoryRecords;
  pathRecords;
  /**
   * @param input the allowlisted module names, advisories, and module paths
   */
  constructor(input) {
    this.modules = [];
    this.advisories = [];
    this.paths = [];
    this.moduleRecords = [];
    this.advisoryRecords = [];
    this.pathRecords = [];
    if (!input) {
      return;
    }
    for (const allowlist of input) {
      if (typeof allowlist === "number") {
        throw new TypeError(
          "Unsupported number as allowlist. Perform codemod to update config to use GitHub advisory as identifiers: https://github.com/quinnturner/audit-ci-codemod with `npx @quinnturner/audit-ci-codemod`. See also: https://github.com/IBM/audit-ci/pull/217"
        );
      }
      const allowlistNspRecord = normalizeAllowlistRecord(allowlist);
      if (!isNSPRecordActive(allowlistNspRecord)) {
        continue;
      }
      const allowlistId = typeof allowlist === "string" ? allowlist : getAllowlistId(allowlistNspRecord);
      if (allowlistId.includes(">") || allowlistId.includes("|")) {
        this.paths.push(allowlistId);
        this.pathRecords.push(allowlistNspRecord);
      } else if (isGitHubAdvisoryId(allowlistId)) {
        this.advisories.push(allowlistId);
        this.advisoryRecords.push(allowlistNspRecord);
      } else {
        this.modules.push(allowlistId);
        this.moduleRecords.push(allowlistNspRecord);
      }
    }
  }
  static mapConfigToAllowlist(config) {
    const { allowlist } = config;
    const deduplicatedAllowlist = dedupeAllowlistRecords(allowlist || []);
    const allowlistObject = new _Allowlist(deduplicatedAllowlist);
    return allowlistObject;
  }
};
var allowlist_default = Allowlist;

// lib/npm-auditor.ts
var npm_auditor_exports = {};
__export(npm_auditor_exports, {
  audit: () => audit,
  auditWithFullConfig: () => auditWithFullConfig,
  isV2Audit: () => isV2Audit,
  report: () => report
});

// lib/config.ts
var import_fs = require("fs");
var import_jju = __toESM(require("jju"), 1);
var path = __toESM(require("path"), 1);
var import_helpers = require("yargs/helpers");
var import_yargs = __toESM(require("yargs"), 1);

// lib/map-vulnerability.ts
function mapVulnerabilityLevelInput({
  low,
  l,
  moderate,
  m,
  high,
  h,
  critical,
  c
}) {
  if (low || l) {
    return { low: true, moderate: true, high: true, critical: true };
  }
  if (moderate || m) {
    return { low: false, moderate: true, high: true, critical: true };
  }
  if (high || h) {
    return { low: false, moderate: false, high: true, critical: true };
  }
  if (critical || c) {
    return { low: false, moderate: false, high: false, critical: true };
  }
  return { low: false, moderate: false, high: false, critical: false };
}

// lib/config.ts
function mapReportTypeInput(config) {
  const { "report-type": reportType } = config;
  switch (reportType) {
    case "full":
    case "important":
    case "summary": {
      return reportType;
    }
    default: {
      throw new Error(
        `Invalid report type: ${reportType}. Should be \`['important', 'full', 'summary']\`.`
      );
    }
  }
}
function mapExtraArgumentsInput(config) {
  return config["extra-args"].map((a) => a.replace(/^\\/, ""));
}
function resolvePackageManagerType(pmArgument, directory) {
  switch (pmArgument) {
    case "npm":
    case "pnpm":
    case "yarn": {
      return pmArgument;
    }
    case "auto": {
      const getPath = (file) => path.resolve(directory, file);
      const packageLockExists = (0, import_fs.existsSync)(getPath("package-lock.json"));
      if (packageLockExists)
        return "npm";
      const shrinkwrapExists = (0, import_fs.existsSync)(getPath("npm-shrinkwrap.json"));
      if (shrinkwrapExists)
        return "npm";
      const yarnLockExists = (0, import_fs.existsSync)(getPath("yarn.lock"));
      if (yarnLockExists)
        return "yarn";
      const pnpmLockExists = (0, import_fs.existsSync)(getPath("pnpm-lock.yaml"));
      if (pnpmLockExists)
        return "pnpm";
      throw new Error(
        "Cannot establish package-manager type, missing package-lock.json, yarn.lock, and pnpm-lock.yaml."
      );
    }
    default: {
      throw new Error(`Unexpected package manager argument: ${pmArgument}`);
    }
  }
}
var defaults = {
  low: false,
  moderate: false,
  high: false,
  critical: false,
  "skip-dev": false,
  "pass-enoaudit": false,
  "retry-count": 5,
  "report-type": "important",
  report: false,
  directory: "./",
  "package-manager": "auto",
  "show-not-found": true,
  "show-found": true,
  registry: void 0,
  summary: false,
  allowlist: [],
  "output-format": "text",
  "extra-args": []
};
function mapArgvToAuditCiConfig(argv) {
  const allowlist = allowlist_default.mapConfigToAllowlist(argv);
  const {
    low,
    moderate,
    high,
    critical,
    "package-manager": packageManager,
    directory
  } = argv;
  const resolvedPackageManager = resolvePackageManagerType(
    packageManager,
    directory
  );
  const result = {
    ...argv,
    "package-manager": resolvedPackageManager,
    levels: mapVulnerabilityLevelInput({
      low,
      moderate,
      high,
      critical
    }),
    "report-type": mapReportTypeInput(argv),
    allowlist,
    "extra-args": mapExtraArgumentsInput(argv)
  };
  return result;
}
function mapAuditCiConfigToAuditCiFullConfig(config) {
  const packageManager = config["package-manager"] ?? defaults["package-manager"];
  const directory = config.directory ?? defaults.directory;
  const resolvedPackageManager = resolvePackageManagerType(
    packageManager,
    directory
  );
  const allowlist = allowlist_default.mapConfigToAllowlist({
    allowlist: config.allowlist ?? defaults.allowlist
  });
  const levels = mapVulnerabilityLevelInput({
    low: config.low ?? defaults.low,
    moderate: config.moderate ?? defaults.moderate,
    high: config.high ?? defaults.high,
    critical: config.critical ?? defaults.critical
  });
  const fullConfig = {
    "skip-dev": config["skip-dev"] ?? defaults["skip-dev"],
    "pass-enoaudit": config["pass-enoaudit"] ?? defaults["pass-enoaudit"],
    "retry-count": config["retry-count"] ?? defaults["retry-count"],
    "report-type": config["report-type"] ?? defaults["report-type"],
    "package-manager": resolvedPackageManager,
    directory,
    report: config.report ?? defaults.report,
    registry: config.registry ?? defaults.registry,
    "show-not-found": config["show-not-found"] ?? defaults["show-not-found"],
    "show-found": config["show-found"] ?? defaults["show-found"],
    summary: config.summary ?? defaults.summary,
    "output-format": config["output-format"] ?? defaults["output-format"],
    allowlist,
    levels,
    "extra-args": config["extra-args"] ?? defaults["extra-args"]
  };
  return fullConfig;
}
async function runYargs() {
  const { argv } = (0, import_yargs.default)((0, import_helpers.hideBin)(process.argv)).config(
    "config",
    (configPath) => (
      // Supports JSON, JSONC, & JSON5
      import_jju.default.parse((0, import_fs.readFileSync)(configPath, "utf8"), {
        // When passing an allowlist using NSRecord syntax, yargs will throw an error
        // "Invalid JSON config file". We need to add this flag to prevent that.
        null_prototype: false
      })
    )
  ).options({
    l: {
      alias: "low",
      default: defaults.low,
      describe: "Exit for low vulnerabilities or higher",
      type: "boolean"
    },
    m: {
      alias: "moderate",
      default: defaults.moderate,
      describe: "Exit for moderate vulnerabilities or higher",
      type: "boolean"
    },
    h: {
      alias: "high",
      default: defaults.high,
      describe: "Exit for high vulnerabilities or higher",
      type: "boolean"
    },
    c: {
      alias: "critical",
      default: defaults.critical,
      describe: "Exit for critical vulnerabilities",
      type: "boolean"
    },
    p: {
      alias: "package-manager",
      default: defaults["package-manager"],
      describe: "Choose a package manager",
      choices: ["auto", "npm", "yarn", "pnpm"]
    },
    r: {
      alias: "report",
      default: defaults.report,
      describe: "Show a full audit report",
      type: "boolean"
    },
    s: {
      alias: "summary",
      default: defaults.summary,
      describe: "Show a summary audit report",
      type: "boolean"
    },
    a: {
      alias: "allowlist",
      default: [],
      describe: "Allowlist module names (example), advisories (123), and module paths (123|example1>example2)",
      type: "array"
    },
    d: {
      alias: "directory",
      default: "./",
      describe: "The directory containing the package.json to audit",
      type: "string"
    },
    o: {
      alias: "output-format",
      default: "text",
      describe: "The format of the output of audit-ci",
      choices: ["text", "json"]
    },
    "show-found": {
      default: defaults["show-found"],
      describe: "Show allowlisted advisories that are found",
      type: "boolean"
    },
    "show-not-found": {
      default: defaults["show-not-found"],
      describe: "Show allowlisted advisories that are not found",
      type: "boolean"
    },
    registry: {
      default: defaults.registry,
      describe: "The registry to resolve packages by name and version",
      type: "string"
    },
    "report-type": {
      default: defaults["report-type"],
      describe: "Format for the audit report results",
      type: "string",
      choices: ["important", "summary", "full"]
    },
    "retry-count": {
      default: defaults["retry-count"],
      describe: "The number of attempts audit-ci calls an unavailable registry before failing",
      type: "number"
    },
    "pass-enoaudit": {
      default: defaults["pass-enoaudit"],
      describe: "Pass if no audit is performed due to the registry returning ENOAUDIT",
      type: "boolean"
    },
    "skip-dev": {
      default: defaults["skip-dev"],
      describe: "Skip devDependencies",
      type: "boolean"
    },
    "extra-args": {
      default: [],
      describe: "Pass additional arguments to the underlying audit command",
      type: "array"
    }
  }).help("help");
  const awaitedArgv = await argv;
  const auditCiConfig = mapArgvToAuditCiConfig(awaitedArgv);
  return auditCiConfig;
}

// lib/model.ts
var SUPPORTED_SEVERITY_LEVELS = /* @__PURE__ */ new Set([
  "critical",
  "high",
  "moderate",
  "low"
]);
var prependPath = (newItem, currentPath) => `${newItem}>${currentPath}`;
var isVia = (via) => {
  return typeof via !== "string";
};
var Model = class {
  failingSeverities;
  allowlist;
  allowlistedModulesFound;
  allowlistedAdvisoriesFound;
  allowlistedPathsFound;
  advisoriesFound;
  advisoryPathsFound;
  constructor(config) {
    const unsupported = Object.keys(config.levels).filter(
      (level) => !SUPPORTED_SEVERITY_LEVELS.has(level)
    );
    if (unsupported.length > 0) {
      throw new Error(
        `Unsupported severity levels found: ${unsupported.sort().join(", ")}`
      );
    }
    this.failingSeverities = config.levels;
    this.allowlist = config.allowlist;
    this.allowlistedModulesFound = [];
    this.allowlistedAdvisoriesFound = [];
    this.allowlistedPathsFound = [];
    this.advisoriesFound = [];
    this.advisoryPathsFound = [];
  }
  process(advisory) {
    const {
      severity,
      module_name: moduleName,
      github_advisory_id: githubAdvisoryId,
      findings
    } = advisory;
    if (severity !== "info" && !this.failingSeverities[severity]) {
      return;
    }
    if (this.allowlist.modules.includes(moduleName)) {
      if (!this.allowlistedModulesFound.includes(moduleName)) {
        this.allowlistedModulesFound.push(moduleName);
      }
      return;
    }
    if (this.allowlist.advisories.includes(githubAdvisoryId)) {
      if (!this.allowlistedAdvisoriesFound.includes(githubAdvisoryId)) {
        this.allowlistedAdvisoriesFound.push(githubAdvisoryId);
      }
      return;
    }
    const allowlistedPathsFoundSet = /* @__PURE__ */ new Set();
    const flattenedPaths = findings.flatMap((finding) => finding.paths);
    const flattenedAllowlist = flattenedPaths.map(
      (path2) => `${githubAdvisoryId}|${path2}`
    );
    const { truthy, falsy } = partition(
      flattenedAllowlist,
      (path2) => this.allowlist.paths.some(
        (allowedPath) => matchString(allowedPath, path2)
      )
    );
    for (const path2 of truthy) {
      allowlistedPathsFoundSet.add(path2);
    }
    this.allowlistedPathsFound.push(...allowlistedPathsFoundSet);
    const isAllowListed = falsy.length === 0;
    if (isAllowListed) {
      return;
    }
    this.advisoriesFound.push(advisory);
    this.advisoryPathsFound.push(...falsy);
  }
  load(parsedOutput) {
    if ("advisories" in parsedOutput && parsedOutput.advisories) {
      for (const advisory of Object.values(parsedOutput.advisories)) {
        advisory.github_advisory_id = gitHubAdvisoryUrlToAdvisoryId(
          advisory.url
        );
        for (const finding of advisory.findings) {
          finding.paths = finding.paths.map((path2) => path2.replace(".>", ""));
        }
        this.process(advisory);
      }
      return this.getSummary();
    }
    if ("vulnerabilities" in parsedOutput && parsedOutput.vulnerabilities) {
      const advisoryMap = /* @__PURE__ */ new Map();
      for (const vulnerability of Object.values(parsedOutput.vulnerabilities)) {
        const { via: vias, isDirect } = vulnerability;
        for (const via of vias) {
          if (!isVia(via)) {
            continue;
          }
          const { source, url, name, severity } = via;
          if (!advisoryMap.has(source)) {
            advisoryMap.set(source, {
              id: source,
              github_advisory_id: gitHubAdvisoryUrlToAdvisoryId(url),
              module_name: name,
              severity,
              url,
              // This will eventually be an array.
              // However, to improve the performance of deduplication,
              // start with a set.
              findingsSet: new Set(isDirect ? [name] : []),
              findings: []
            });
          }
        }
      }
      const visitedModules = /* @__PURE__ */ new Map();
      for (const vuln of Object.entries(parsedOutput.vulnerabilities)) {
        const moduleName = vuln[0];
        const vulnerability = vuln[1];
        const { via: vias, isDirect } = vulnerability;
        if (vias.length === 0 || typeof vias[0] === "string") {
          continue;
        }
        const visited = /* @__PURE__ */ new Set();
        const recursiveMagic = (cVuln, dependencyPath) => {
          const visitedModule = visitedModules.get(cVuln.name);
          if (visitedModule) {
            return visitedModule.map((name) => {
              const resultWithExtraCarat = prependPath(name, dependencyPath);
              return resultWithExtraCarat.slice(
                0,
                Math.max(0, resultWithExtraCarat.length - 1)
              );
            });
          }
          if (visited.has(cVuln.name)) {
            return [dependencyPath];
          }
          visited.add(cVuln.name);
          const newPath = prependPath(cVuln.name, dependencyPath);
          if (cVuln.effects.length === 0) {
            return [newPath.slice(0, Math.max(0, newPath.length - 1))];
          }
          const result2 = cVuln.effects.flatMap(
            (effect) => recursiveMagic(parsedOutput.vulnerabilities[effect], newPath)
          );
          return result2;
        };
        const result = recursiveMagic(vulnerability, "");
        if (isDirect) {
          result.push(moduleName);
        }
        const advisories = vias.filter(
          (via) => typeof via !== "string"
        ).map((via) => via.source).map((id) => advisoryMap.get(id)).filter(Boolean);
        for (const advisory of advisories) {
          for (const path2 of result) {
            advisory.findingsSet.add(path2);
          }
        }
        visitedModules.set(moduleName, result);
      }
      for (const [, advisory] of advisoryMap) {
        advisory.findings = [{ paths: [...advisory.findingsSet] }];
        delete advisory.findingsSet;
        this.process(advisory);
      }
    }
    return this.getSummary();
  }
  getSummary(advisoryMapper = (a) => a.github_advisory_id) {
    this.advisoriesFound.sort();
    this.advisoryPathsFound = [...new Set(this.advisoryPathsFound)].sort();
    this.allowlistedAdvisoriesFound.sort();
    this.allowlistedModulesFound.sort();
    this.allowlistedPathsFound.sort();
    const foundSeverities = /* @__PURE__ */ new Set();
    for (const { severity } of this.advisoriesFound) {
      if (severity !== "info") {
        foundSeverities.add(severity);
      }
    }
    const failedLevelsFound = [...foundSeverities].sort();
    const advisoriesFound = [
      ...new Set(this.advisoriesFound.map((a) => advisoryMapper(a)))
    ].sort();
    const allowlistedAdvisoriesNotFound = this.allowlist.advisories.filter((id) => !this.allowlistedAdvisoriesFound.includes(id)).sort();
    const allowlistedModulesNotFound = this.allowlist.modules.filter((id) => !this.allowlistedModulesFound.includes(id)).sort();
    const allowlistedPathsNotFound = this.allowlist.paths.filter(
      (id) => !this.allowlistedPathsFound.some(
        (foundPath) => matchString(id, foundPath)
      )
    ).sort();
    const summary = {
      advisoriesFound,
      failedLevelsFound,
      allowlistedAdvisoriesNotFound,
      allowlistedModulesNotFound,
      allowlistedPathsNotFound,
      allowlistedAdvisoriesFound: this.allowlistedAdvisoriesFound,
      allowlistedModulesFound: this.allowlistedModulesFound,
      allowlistedPathsFound: this.allowlistedPathsFound,
      advisoryPathsFound: this.advisoryPathsFound
    };
    return summary;
  }
};
var model_default = Model;

// lib/npm-auditor.ts
async function runNpmAudit(config) {
  const {
    directory,
    registry,
    _npm,
    "skip-dev": skipDevelopmentDependencies,
    "extra-args": extraArguments
  } = config;
  const npmExec = _npm || "npm";
  let stdoutBuffer = {};
  function outListener(data) {
    stdoutBuffer = { ...stdoutBuffer, ...data };
  }
  const stderrBuffer = [];
  function errorListener(line) {
    stderrBuffer.push(line);
  }
  const arguments_ = ["audit", "--json"];
  if (registry) {
    arguments_.push("--registry", registry);
  }
  if (skipDevelopmentDependencies) {
    arguments_.push("--production");
  }
  if (extraArguments) {
    arguments_.push(...extraArguments);
  }
  const options = { cwd: directory };
  await runProgram(npmExec, arguments_, options, outListener, errorListener);
  if (stderrBuffer.length > 0) {
    throw new Error(
      `Invocation of npm audit failed:
${stderrBuffer.join("\n")}`
    );
  }
  return stdoutBuffer;
}
function isV2Audit(parsedOutput) {
  return "auditReportVersion" in parsedOutput && parsedOutput.auditReportVersion === 2;
}
function printReport(parsedOutput, levels, reportType, outputFormat) {
  const printReportObject = (text, object) => {
    if (outputFormat === "text") {
      console.log(blue, text);
    }
    console.log(JSON.stringify(object, void 0, 2));
  };
  switch (reportType) {
    case "full": {
      printReportObject("NPM audit report JSON:", parsedOutput);
      break;
    }
    case "important": {
      const relevantAdvisories = (() => {
        if (isV2Audit(parsedOutput)) {
          const advisories = parsedOutput.vulnerabilities;
          const relevantAdvisoryLevels = Object.keys(advisories).filter(
            (advisory) => {
              const severity = advisories[advisory].severity;
              return severity !== "info" && levels[severity];
            }
          );
          const relevantAdvisories2 = {};
          for (const advisory of relevantAdvisoryLevels) {
            relevantAdvisories2[advisory] = advisories[advisory];
          }
          return relevantAdvisories2;
        } else {
          const advisories = parsedOutput.advisories;
          const advisoryKeys = Object.keys(advisories);
          const relevantAdvisoryLevels = advisoryKeys.filter((advisory) => {
            const severity = advisories[advisory].severity;
            return severity !== "info" && levels[severity];
          });
          const relevantAdvisories2 = {};
          for (const advisory of relevantAdvisoryLevels) {
            relevantAdvisories2[advisory] = advisories[advisory];
          }
          return relevantAdvisories2;
        }
      })();
      const keyFindings = {
        advisories: relevantAdvisories,
        metadata: parsedOutput.metadata
      };
      printReportObject("NPM audit report results:", keyFindings);
      break;
    }
    case "summary": {
      printReportObject("NPM audit report summary:", parsedOutput.metadata);
      break;
    }
    default: {
      throw new Error(
        `Invalid report type: ${reportType}. Should be \`['important', 'full', 'summary']\`.`
      );
    }
  }
}
function report(parsedOutput, config, reporter) {
  const {
    levels,
    "report-type": reportType,
    "output-format": outputFormat
  } = config;
  printReport(parsedOutput, levels, reportType, outputFormat);
  const model = new model_default(config);
  const summary = model.load(parsedOutput);
  return reporter(summary, config, parsedOutput);
}
async function auditWithFullConfig(config, reporter = reportAudit) {
  const parsedOutput = await runNpmAudit(config);
  if ("error" in parsedOutput) {
    const { code, summary } = parsedOutput.error;
    throw new Error(`code ${code}: ${summary}`);
  } else if ("message" in parsedOutput) {
    throw new Error(parsedOutput.message);
  }
  return report(parsedOutput, config, reporter);
}
async function audit(config, reporter = reportAudit) {
  const fullConfig = mapAuditCiConfigToAuditCiFullConfig(config);
  return await auditWithFullConfig(fullConfig, reporter);
}

// lib/pnpm-auditor.ts
var pnpm_auditor_exports = {};
__export(pnpm_auditor_exports, {
  audit: () => audit2,
  auditWithFullConfig: () => auditWithFullConfig2,
  report: () => report2
});
var import_child_process = require("child_process");
var semver = __toESM(require("semver"), 1);
var MINIMUM_PNPM_AUDIT_REGISTRY_VERSION = "5.4.0";
async function runPnpmAudit(config) {
  const {
    directory,
    registry,
    _pnpm,
    "skip-dev": skipDevelopmentDependencies,
    "extra-args": extraArguments
  } = config;
  const pnpmExec = _pnpm || "pnpm";
  const stdoutBuffer = {};
  function outListener(data) {
    Object.assign(stdoutBuffer, data);
  }
  const stderrBuffer = [];
  function errorListener(line) {
    stderrBuffer.push(line);
  }
  const arguments_ = ["audit", "--json"];
  if (registry) {
    const pnpmVersion = getPnpmVersion(directory);
    if (pnpmAuditSupportsRegistry(pnpmVersion)) {
      arguments_.push("--registry", registry);
    } else {
      console.warn(
        yellow,
        `Update PNPM to version >=${MINIMUM_PNPM_AUDIT_REGISTRY_VERSION} to use the --registry flag`
      );
    }
  }
  if (skipDevelopmentDependencies) {
    arguments_.push("--prod");
  }
  if (extraArguments) {
    arguments_.push(...extraArguments);
  }
  const options = { cwd: directory };
  await runProgram(pnpmExec, arguments_, options, outListener, errorListener);
  if (stderrBuffer.length > 0) {
    throw new Error(
      `Invocation of pnpm audit failed:
${stderrBuffer.join("\n")}`
    );
  }
  return stdoutBuffer;
}
function printReport2(parsedOutput, levels, reportType, outputFormat) {
  const printReportObject = (text, object) => {
    if (outputFormat === "text") {
      console.log(blue, text);
    }
    console.log(JSON.stringify(object, void 0, 2));
  };
  switch (reportType) {
    case "full": {
      printReportObject("PNPM audit report JSON:", parsedOutput);
      break;
    }
    case "important": {
      const { advisories, metadata } = parsedOutput;
      const advisoryKeys = Object.keys(advisories);
      const relevantAdvisoryLevels = advisoryKeys.filter((advisory) => {
        const severity = advisories[advisory].severity;
        return severity !== "info" && levels[severity];
      });
      const relevantAdvisories = {};
      for (const advisory of relevantAdvisoryLevels) {
        relevantAdvisories[advisory] = advisories[advisory];
      }
      const keyFindings = {
        advisories: relevantAdvisories,
        metadata
      };
      printReportObject("PNPM audit report results:", keyFindings);
      break;
    }
    case "summary": {
      printReportObject("PNPM audit report summary:", parsedOutput.metadata);
      break;
    }
    default: {
      throw new Error(
        `Invalid report type: ${reportType}. Should be \`['important', 'full', 'summary']\`.`
      );
    }
  }
}
function report2(parsedOutput, config, reporter) {
  const {
    levels,
    "report-type": reportType,
    "output-format": outputFormat
  } = config;
  printReport2(parsedOutput, levels, reportType, outputFormat);
  const model = new model_default(config);
  const summary = model.load(parsedOutput);
  return reporter(summary, config, parsedOutput);
}
async function auditWithFullConfig2(config, reporter = reportAudit) {
  const parsedOutput = await runPnpmAudit(config);
  if ("error" in parsedOutput) {
    const { code, summary } = parsedOutput.error;
    throw new Error(`code ${code}: ${summary}`);
  }
  return report2(parsedOutput, config, reporter);
}
async function audit2(config, reporter = reportAudit) {
  const fullConfig = mapAuditCiConfigToAuditCiFullConfig(config);
  return await auditWithFullConfig2(fullConfig, reporter);
}
function pnpmAuditSupportsRegistry(pnpmVersion) {
  return semver.gte(pnpmVersion, MINIMUM_PNPM_AUDIT_REGISTRY_VERSION);
}
function getPnpmVersion(cwd) {
  return (0, import_child_process.execSync)("pnpm -v", { cwd }).toString().replace("\n", "");
}

// lib/yarn-auditor.ts
var yarn_auditor_exports = {};
__export(yarn_auditor_exports, {
  audit: () => audit3,
  auditWithFullConfig: () => auditWithFullConfig3
});

// lib/yarn-version.ts
var import_child_process2 = require("child_process");
var import_semver = __toESM(require("semver"), 1);
var MINIMUM_YARN_CLASSIC_VERSION = "1.12.3";
var MINIMUM_YARN_BERRY_VERSION = "2.4.0";
var MINIMUM_YARN_AUDIT_REGISTRY_VERSION = "99.99.99";
function yarnSupportsClassicAudit(yarnVersion) {
  return import_semver.default.satisfies(yarnVersion, `^${MINIMUM_YARN_CLASSIC_VERSION}`);
}
function yarnSupportsBerryAudit(yarnVersion) {
  return import_semver.default.gte(yarnVersion, MINIMUM_YARN_BERRY_VERSION);
}
function yarnSupportsAudit(yarnVersion) {
  return yarnSupportsClassicAudit(yarnVersion) || yarnSupportsBerryAudit(yarnVersion);
}
function yarnAuditSupportsRegistry(yarnVersion) {
  return import_semver.default.gte(yarnVersion, MINIMUM_YARN_AUDIT_REGISTRY_VERSION);
}
var versionMap = /* @__PURE__ */ new Map();
function getYarnVersion(yarnExec = "yarn", cwd) {
  const key = `${yarnExec}:${cwd}`;
  let version = versionMap.get(key);
  if (version)
    return version;
  version = (0, import_child_process2.execSync)(`${yarnExec} -v`, { cwd }).toString().replace("\n", "");
  versionMap.set(key, version);
  return version;
}

// lib/yarn-auditor.ts
var printJson = (data) => {
  console.log(JSON.stringify(data, void 0, 2));
};
var isClassicAuditAdvisory = (data, type) => {
  return type === "auditAdvisory";
};
var isClassicAuditSummary = (data, type) => {
  return type === "auditSummary";
};
async function auditWithFullConfig3(config, reporter = reportAudit) {
  const {
    levels,
    registry,
    "report-type": reportType,
    "skip-dev": skipDevelopmentDependencies,
    "output-format": outputFormat,
    _yarn,
    directory,
    "extra-args": extraArguments
  } = config;
  const yarnExec = _yarn || "yarn";
  let missingLockFile = false;
  const model = new model_default(config);
  const yarnVersion = getYarnVersion(yarnExec, directory);
  const isYarnVersionSupported = yarnSupportsAudit(yarnVersion);
  if (!isYarnVersionSupported) {
    throw new Error(
      `Yarn ${yarnVersion} not supported, must be ^${MINIMUM_YARN_CLASSIC_VERSION} or >=${MINIMUM_YARN_BERRY_VERSION}`
    );
  }
  const isYarnClassic = yarnSupportsClassicAudit(yarnVersion);
  const yarnName = isYarnClassic ? `Yarn` : `Yarn Berry`;
  function isClassicGuard(response) {
    return isYarnClassic;
  }
  const printHeader = (text) => {
    if (outputFormat === "text") {
      console.log(blue, text);
    }
  };
  switch (reportType) {
    case "full": {
      printHeader(`${yarnName} audit report JSON:`);
      break;
    }
    case "important": {
      printHeader(`${yarnName} audit report results:`);
      break;
    }
    case "summary": {
      printHeader(`${yarnName} audit report summary:`);
      break;
    }
    default: {
      throw new Error(
        `Invalid report type: ${reportType}. Should be \`['important', 'full', 'summary']\`.`
      );
    }
  }
  let printAuditData;
  switch (reportType) {
    case "full": {
      printAuditData = (line) => {
        printJson(line);
      };
      break;
    }
    case "important": {
      printAuditData = isYarnClassic ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ type, data }) => {
          if (isClassicAuditAdvisory(data, type)) {
            const severity = data.advisory.severity;
            if (severity !== "info" && levels[severity]) {
              printJson(data);
            }
          } else if (isClassicAuditSummary(data, type)) {
            printJson(data);
          }
        }
      ) : ({ metadata }) => {
        printJson(metadata);
      };
      break;
    }
    case "summary": {
      printAuditData = isYarnClassic ? ({ type, data }) => {
        if (isClassicAuditAdvisory(data, type)) {
          printJson(data);
        }
      } : ({ metadata }) => {
        printJson(metadata);
      };
      break;
    }
    default: {
      throw new Error(
        `Invalid report type: ${reportType}. Should be \`['important', 'full', 'summary']\`.`
      );
    }
  }
  function outListener(line) {
    try {
      if (isClassicGuard(line)) {
        const { type, data } = line;
        printAuditData(line);
        if (type === "info" && data === "No lockfile found.") {
          missingLockFile = true;
          return;
        }
        if (type !== "auditAdvisory") {
          return;
        }
        model.process(data.advisory);
      } else {
        printAuditData(line);
        if ("advisories" in line) {
          for (const advisory of Object.values(
            line.advisories
          )) {
            model.process(advisory);
          }
        }
      }
    } catch (error) {
      console.error(red, `ERROR: Cannot JSONStream.parse response:`);
      console.error(line);
      throw error;
    }
  }
  const stderrBuffer = [];
  function errorListener(line) {
    stderrBuffer.push(line);
    if (line.type === "error") {
      throw new Error(line.data);
    }
  }
  const options = { cwd: directory };
  const arguments_ = isYarnClassic ? [
    "audit",
    "--json",
    ...skipDevelopmentDependencies ? ["--groups", "dependencies"] : []
  ] : [
    "npm",
    "audit",
    "--recursive",
    "--json",
    "--all",
    ...skipDevelopmentDependencies ? ["--environment", "production"] : []
  ];
  if (registry) {
    const auditRegistrySupported = yarnAuditSupportsRegistry(yarnVersion);
    if (auditRegistrySupported) {
      arguments_.push("--registry", registry);
    } else {
      console.warn(
        yellow,
        "Yarn audit does not support the registry flag yet."
      );
    }
  }
  if (extraArguments) {
    arguments_.push(...extraArguments);
  }
  await runProgram(yarnExec, arguments_, options, outListener, errorListener);
  if (missingLockFile) {
    console.warn(
      yellow,
      "No yarn.lock file. This does not affect auditing, but it may be a mistake."
    );
  }
  const summary = model.getSummary((a) => a.github_advisory_id);
  return reporter(summary, config);
}
async function audit3(config, reporter = reportAudit) {
  const fullConfig = mapAuditCiConfigToAuditCiFullConfig(config);
  return await auditWithFullConfig3(fullConfig, reporter);
}

// lib/audit.ts
var PARTIAL_RETRY_ERROR_MSG = {
  // The three ENOAUDIT error messages for NPM are:
  // `Either your login credentials are invalid or your registry (${opts.registry}) does not support audit.`
  // `Your configured registry (${opts.registry}) does not support audit requests.`
  // `Your configured registry (${opts.registry}) may not support audit requests, or the audit endpoint may be temporarily unavailable.`
  // Between them, all three use the phrasing 'not support audit'.
  npm: [`not support audit`],
  yarn: ["503 Service Unavailable"],
  // TODO: Identify retry-able error message for pnpm
  pnpm: []
};
function getAuditor(packageManager) {
  switch (packageManager) {
    case "yarn": {
      return yarn_auditor_exports;
    }
    case "npm": {
      return npm_auditor_exports;
    }
    case "pnpm": {
      return pnpm_auditor_exports;
    }
    default: {
      throw new Error(`Invalid package manager: ${packageManager}`);
    }
  }
}
async function audit4(config, reporter) {
  const {
    "pass-enoaudit": passENoAudit,
    "retry-count": maxRetryCount,
    "package-manager": packageManager,
    "output-format": outputFormat
  } = config;
  const auditor = getAuditor(packageManager);
  async function run(attempt = 0) {
    try {
      const result = await auditor.auditWithFullConfig(config, reporter);
      return result;
    } catch (error) {
      const message = error && typeof error === "object" && "message" in error ? error.message : error;
      const isRetryableMessage = typeof message === "string" && PARTIAL_RETRY_ERROR_MSG[packageManager].some(
        (retryErrorMessage) => message.includes(retryErrorMessage)
      );
      const shouldRetry = attempt < maxRetryCount && isRetryableMessage;
      if (shouldRetry) {
        if (outputFormat === "text") {
          console.log("Retrying audit...");
        }
        return run(attempt + 1);
      }
      const shouldPassWithoutAuditing = passENoAudit && isRetryableMessage;
      if (shouldPassWithoutAuditing) {
        console.warn(
          yellow,
          `ACTION RECOMMENDED: An audit could not performed due to ${maxRetryCount} audits that resulted in ENOAUDIT. Perform an audit manually and verify that no significant vulnerabilities exist before merging.`
        );
        return;
      }
      throw error;
    }
  }
  return await run();
}
var audit_default = audit4;

// lib/audit-ci.ts
async function runAuditCi() {
  const auditCiConfig = await runYargs();
  const { "package-manager": packageManager, "output-format": outputFormat } = auditCiConfig;
  try {
    await audit_default(auditCiConfig);
    if (outputFormat === "text") {
      console.log(green, `Passed ${packageManager} security audit.`);
    }
  } catch (error) {
    if (outputFormat === "text") {
      const message = error instanceof Error ? error.message : error;
      console.error(red, message);
      console.error(red, "Exiting...");
    }
    process.exitCode = 1;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Allowlist,
  gitHubAdvisoryIdToUrl,
  gitHubAdvisoryUrlToAdvisoryId,
  isGitHubAdvisoryId,
  mapVulnerabilityLevelInput,
  npmAudit,
  pnpmAudit,
  runAuditCi,
  yarnAudit
});
//# sourceMappingURL=index.cjs.map