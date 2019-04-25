/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import defaultRegistry from '../../default-registry';

const { Consumer, Provider } = createContext( defaultRegistry );

/**
 * A context consumer component which provides to the rendered child function a
 * reference to the current registry context.
 *
 * @link https://reactjs.org/docs/context.html#contextconsumer
 *
 * @type {WPComponent}
 */
export const RegistryConsumer = Consumer;

/**
 * A context provider component which provides to descendent RegistryConsumer
 * elements a reference to the given registry context.
 *
 * @link https://reactjs.org/docs/context.html#contextprovider
 *
 * @type {WPComponent}
 */
export default Provider;
