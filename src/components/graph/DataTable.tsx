import { useState } from 'react';
import { CompactPicker } from 'react-color';

interface Props {
  type: string;
  row: number;
  setRow: (row: number) => void;
  col: number;
  setCol: (col: number) => void;
  data: number[][];
  setData: (data: number[][]) => void;
  labels: string[];
  setLabels: (labels: string[]) => void;
  items: string[];
  setItems: (items: string[]) => void;
  colors: string[];
  setColors: (colors: string[]) => void;
  xyChartTitle: { x: string; y: string };
  setXYChartTitle: (axis: 'x' | 'y', title: string) => void;
}

interface CellProps {
  type: string;
  value: string | number;
  setText: (text: string) => void;
  color?: string;
  setColor?: (color: string) => void;
}

const InputCell = ({ type, value, setText, color, setColor }: CellProps) => {
  const [opened, setOpened] = useState(false);
  return (
    <div className="relative flex">
      <input
        type={type}
        className="block w-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
        value={value || (type === 'number' ? 0 : '')}
        required
        onChange={(e) => setText(e.target.value)}
      />
      {color && setColor && (
        <>
          <button
            onClick={() => setOpened((prev) => !prev)}
            className="h-10 w-10"
            style={{ backgroundColor: color }}
          />
          {opened && (
            <div className="absolute top-full z-10">
              <div
                className="fixed right-0 top-0 left-0 bottom-0"
                onClick={() => setOpened(false)}
              />
              <CompactPicker
                color={color}
                onChange={(color) => {
                  setColor(color.hex);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const XYTitleSetter = ({ type, xyChartTitle, setXYChartTitle }: Props) => {
  if (type !== 'bar' && type !== 'line') {
    return null;
  }
  const { x: xTitle, y: yTitle } = xyChartTitle;
  return (
    <>
      {['x', 'y'].map((axis) => (
        <div key={axis}>
          <label
            htmlFor={axis}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {axis} axis title
          </label>
          <input
            type="text"
            id={axis}
            className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-blue-500"
            value={axis === 'x' ? xTitle : yTitle}
            onChange={(e) => {
              setXYChartTitle(axis as 'x' | 'y', e.target.value);
            }}
            required
          />
        </div>
      ))}
    </>
  );
};

const RowColSetter = ({ type, row, col, setRow, setCol }: Props) => {
  return (
    <>
      {['row', 'col'].map((label) => (
        <div key={label}>
          <label
            htmlFor={label}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
          <input
            type="number"
            id={label}
            className={`block w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-blue-500 ${
              label === 'row' && type === 'pie' ? 'bg-gray-200' : 'bg-gray-50'
            }`}
            value={label === 'row' ? row : col}
            onChange={(e) => {
              if (label === 'row') {
                setRow(Number(e.target.value));
              } else {
                setCol(Number(e.target.value));
              }
            }}
            required
            disabled={label === 'row' && type === 'pie'}
            min={1}
          />
        </div>
      ))}
    </>
  );
};

const Table = ({
  labels,
  setLabels,
  items,
  setItems,
  setData,
  data,
  type,
  colors,
  setColors,
  row,
  col,
}: Props) => {
  const setLabelWithIdx = (idx: number) => (text: string) => {
    const newLabels = [...labels];
    newLabels[idx] = text;
    setLabels(newLabels);
  };

  const setItemWithIdx = (idx: number) => (text: string) => {
    const newItems = [...items];
    newItems[idx] = text;
    setItems(newItems);
  };

  const setDataWithIdx = (i: number, j: number) => (text: string) => {
    const newData = [...data];
    newData[i][j] = Number(text);
    setData(newData);
  };

  const setColorWithIdx = (idx: number) => (color: string) => {
    const newColors = [...colors];
    newColors[idx] = color;
    setColors(newColors);
  };
  return (
    <table>
      <thead>
        <tr>
          <th />
          {labels.map((label, i) => (
            <th key={i}>
              <InputCell
                value={label}
                color={type === 'pie' ? colors[i] : undefined}
                setColor={type === 'pie' ? setColorWithIdx(i) : undefined}
                type="text"
                setText={setLabelWithIdx(i)}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: row }, (_, i) => i).map((i) => (
          <tr key={`row_${i}`}>
            <td>
              <InputCell
                type="text"
                color={type !== 'pie' ? colors[i] : undefined}
                setColor={type !== 'pie' ? setColorWithIdx(i) : undefined}
                value={items[i]}
                setText={setItemWithIdx(i)}
              />
            </td>
            {Array.from({ length: col }, (_, j) => j).map((j) => (
              <td key={`col_${j}`}>
                <InputCell
                  type="number"
                  value={data[i]?.[j] || 0}
                  setText={setDataWithIdx(i, j)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const DataTable = (props: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-x-2">
        <RowColSetter {...props} />
        <XYTitleSetter {...props} />
      </div>
      <Table {...props} />
    </div>
  );
};

export default DataTable;
