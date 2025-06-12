import { useReducer } from "react";

type SelectedItemsAction<T> =
  | { type: "toggle"; item: T }
  | { type: "clear" }
  | { type: "selectAll"; items: T[] }
  | { type: "deselectAll" };

function selectedItemsReducer<T>(
  state: T[],
  action: SelectedItemsAction<T>
): T[] {
  switch (action.type) {
    case "toggle":
      if (state.includes(action.item)) {
        return state.filter((item) => item !== action.item);
      }
      return [...state, action.item];
    case "clear":
      return [];
    case "selectAll":
      return [...action.items];
    case "deselectAll":
      return [];
    default:
      return state;
  }
}

/**
 * A hook that allows you to select items from a list.
 *
 * Features:
 * - Returns a list of selected items
 * - Provides a function to toggle an item
 * - Provides a function to clear the selected items
 * - Provides a function to see if an item is selected
 * - Provides functions to select/deselect all items
 * - Provides a function to get the number of selected items
 * - Supports both single and multiple selection modes
 *
 * @param items - The array of items to select from
 * @param options - Configuration options
 * @param options.allowMultiple - Whether to allow multiple selections (default: false)
 * @returns An object containing:
 *   - selectedItems: Array of currently selected items
 *   - toggleItem: Function to toggle selection of an item
 *   - clearItems: Function to clear all selected items
 *   - selectAllItems: Function to select all items
 *   - deselectAllItems: Function to deselect all items
 *   - selectedCount: Number of currently selected items
 *   - isItemSelected: Function to check if an item is selected
 */
export function useSelectedItems<T>(
  items: T[],
  {
    allowMultiple = false,
  }: {
    allowMultiple?: boolean;
  } = {}
) {
  const [selectedItems, dispatch] = useReducer(selectedItemsReducer<T>, []);

  return {
    selectedItems,
    toggleItem: (item: T) => {
      if (allowMultiple) {
        dispatch({ type: "toggle", item });
      } else {
        // For single selection, clear and select the new item
        if (selectedItems.includes(item)) {
          dispatch({ type: "clear" });
        } else {
          dispatch({ type: "selectAll", items: [item] });
        }
      }
    },
    clearItems: () => dispatch({ type: "clear" }),
    selectAllItems: () => {
      if (allowMultiple) {
        dispatch({ type: "selectAll", items });
      }
    },
    deselectAllItems: () => dispatch({ type: "deselectAll" }),
    selectedCount: selectedItems.length,
    isItemSelected: (item: T) => selectedItems.includes(item),
  };
}
