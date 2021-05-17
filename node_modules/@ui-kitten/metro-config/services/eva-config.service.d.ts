/**
 * Defines the Eva config passed to UI Kitten metro config
 *
 * @param {EvaMappingPackageName} evaPackage - the name of the eva package.
 * @param {string} customMappingPath - relative path to custom mapping.
 *
 * @example Config for @eva-design/eva package with custom mapping
 * ```
 * const evaConfig = {
 *   evaPackage: '@eva-design/eva',
 *   customMappingPath: './custom-mapping.json',
 * };
 * ```
 */
export interface EvaConfig {
    evaPackage: EvaMappingPackageName;
    customMappingPath?: string;
}
export declare type EvaMappingPackageName = '@eva-design/eva' | '@eva-design/material';
export default class EvaConfigService {
    static MAPPING_PACKAGE_NAMES: EvaMappingPackageName[];
    static validateConfigOrWarn: (config: EvaConfig) => boolean;
    private static isValidEvaPackageName;
}
