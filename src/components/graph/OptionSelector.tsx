interface Props {
  type: string;
  options: any;
  setOptions: (option: any) => void;
}

const assignOption = (options: any, path: string[], value: any) => {
  const originOptions = options;
  const isTitle = path.includes('title');
  for (let i = 0; i < path.length - 1; i++) {
    options[path[i]] ??= {};
    options = options[path[i]];

    if (isTitle && path[i] === 'title') {
      options['display'] = !!(value !== 0 && options['text']);
    }
  }
  options[path[path.length - 1]] = value;
  return originOptions;
};

const chainOption = (options: any, path: string[]) => {
  for (let i = 0; i < path.length - 1; i++) {
    if (options[path[i]] === undefined) {
      return 0;
    }
    options = options[path[i]];
  }
  return options[path[path.length - 1]];
};

const COMMON_OPTIONS = [
  {
    label: 'Label Font Size',
    path: ['plugins', 'datalabels', 'font', 'size'],
  },
  {
    label: 'Legend Font Size',
    path: ['plugins', 'legend', 'labels', 'font', 'size'],
  },
];

const PIE_OPTIONS = [...COMMON_OPTIONS];

const XY_CHART_OPTIONS = [
  ...COMMON_OPTIONS,
  {
    label: 'X Axis Font Size',
    path: ['scales', 'x', 'ticks', 'font', 'size'],
  },
  {
    label: 'Y Axis Font Size',
    path: ['scales', 'y', 'ticks', 'font', 'size'],
  },
  {
    label: 'X Axis Title Font Size',
    path: ['scales', 'x', 'title', 'font', 'size'],
  },
  {
    label: 'Y Axis Title Font Size',
    path: ['scales', 'y', 'title', 'font', 'size'],
  },
];

const RADAR_OPTIONS = [
  ...COMMON_OPTIONS,
  {
    label: 'Point Label Font Size',
    path: ['scales', 'r', 'pointLabels', 'font', 'size'],
  },
];

const OPTIONS_MAP = {
  pie: PIE_OPTIONS,
  line: XY_CHART_OPTIONS,
  bar: XY_CHART_OPTIONS,
  radar: RADAR_OPTIONS,
};

const OptionSelector = ({ type, options, setOptions }: Props) => {
  const optionsList = OPTIONS_MAP[type as keyof typeof OPTIONS_MAP];
  return (
    <div className="flex flex-wrap gap-2">
      {optionsList.map((option) => (
        <div key={option.label}>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            {option.label}
          </label>
          <input
            type="number"
            className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            min={0}
            value={chainOption(options, option.path) || 0}
            onChange={(e) =>
              setOptions(
                assignOption(
                  { ...options },
                  option.path,
                  Number(e.target.value)
                )
              )
            }
          />
        </div>
      ))}
    </div>
  );
};

export default OptionSelector;
