import { FunctionComponent, PropsWithChildren } from 'react';
import * as React from 'react';

export interface ConditionalSlotProps {
  /** Controls the condition to render the component. Set to `false` to skip rendering  */
  condition: boolean | null | undefined | string | number;
}

/**
 * A functional helper to use as a React component.
 * Renders its children only when the condition evaluates to `true`.
 *
 * This component could be used to reduce the *percieved complexity* of code by abstracting conditions outside a single block
 *
 * NOTE: Use for light weight UI tasks ONLY.
 * This component ONLY prevents the children from rendering, but DOES NOT prevent any internal logic from executing
 *
 * ALWAYS Use a native conditional block to prevent heavy logic from executing at all.
 *
 *
 * @param {Object} props - React component props
 * @param {ReactComponent} props.children - React component children
 * @param {boolean} props.condition - Controls the condition to render the component. Set to `false` to skip rendering
 * @return {ReactComponent}
 *
 * @example
 * <ConditionalSlot condition={isSomeCondition()}>
 *      Foo
 * </ConditionalSlot>
 */
const ConditionalSlot: FunctionComponent<PropsWithChildren<ConditionalSlotProps>> = ({
  children,
  condition,
}) => (condition ? <>{children}</> : null);

export default ConditionalSlot;
