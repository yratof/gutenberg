/**
 * External dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );
const { overEvery } = require( 'lodash' );

/**
 * Absolute path to packages directory.
 *
 * @type {string}
 */
const PACKAGES_DIR = path.resolve( __dirname, '../../packages' );

/**
 * Returns true if the given base file name for a file within the packages
 * directory is itself a directory.
 *
 * @param {string} file Packages directory file.
 *
 * @return {boolean} Whether file is a directory.
 */
function isDirectory( file ) {
	return fs.lstatSync( path.resolve( PACKAGES_DIR, file ) ).isDirectory();
}

/**
 * Returns true if the given packages has type "module".
 *
 * @see https://medium.com/@nodejs/announcing-a-new-experimental-modules-1be8d2d6c2ff
 *
 * @param {string} file Packages directory file.
 *
 * @return {boolean} Whether file is a directory.
 */
function isModuleType( file ) {
	const { type = 'module' } = require( path.resolve( PACKAGES_DIR, file, 'package.json' ) );

	return type === 'module';
}

/**
 * Filter predicate, returning true if the given base file name is to be
 * included in the build.
 *
 * @param {string} pkg File base name to test.
 *
 * @return {boolean} Whether to include file in build.
 */
const filterPackages = overEvery( isDirectory, isModuleType );

/**
 * Returns the absolute path of all WordPress packages
 *
 * @return {Array} Package paths
 */
function getPackages() {
	return fs
		.readdirSync( PACKAGES_DIR )
		.filter( filterPackages )
		.map( ( file ) => path.resolve( PACKAGES_DIR, file ) );
}

module.exports = getPackages;
