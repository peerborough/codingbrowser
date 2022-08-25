import { getAtJsPath, setAtJsPath } from '../../util';

export const defaultOption = {
  minimap: {
    enabled: false,
  },
  wordWrap: 'off',
};

export const toggleEditorOption = (option, path) => {
  try {
    const newOptions = { ...option };
    const currentSetting = getAtJsPath(path, newOptions);

    setAtJsPath(path, newOptions, toggleMonaco(currentSetting));
    return newOptions;
  } catch (error) {
    console.warn(`Editors: Could not toggle property ${path}`, error);

    return null;
  }
};

export const toggleMonaco = (input) => {
  if (input === 'off') return 'on';
  if (input === 'on') return 'off';

  return !input;
};
