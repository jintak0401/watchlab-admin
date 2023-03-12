import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Fragment, useEffect, useRef, useState } from 'react';
import React from 'react';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';

import { genRandomColor } from '@/lib/utils';

import DataTable from '@/components/graph/DataTable';
import OptionSelector from '@/components/graph/OptionSelector';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  ChartDataLabels,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

const CHART_MAP = {
  pie: Pie,
  line: Line,
  bar: Bar,
  radar: Radar,
};

interface Props {
  closeModal: () => void;
  uploadGraph: (graphSrc: string) => void;
}

const COMMON_OPTIONS = {
  responsive: false,
  display: true,
  plugins: {
    datalabels: {
      font: {
        size: 0,
      },
    },
    legend: {
      labels: {
        font: {
          size: 15,
        },
      },
    },
  },
};

const PIE_OPTIONS = {
  ...COMMON_OPTIONS,
  position: 'top',
};

const XY_CHART_OPTION = {
  ...COMMON_OPTIONS,
  scales: {
    x: {
      title: {
        display: true,
        text: 'x Title',
        font: {
          size: 15,
        },
      },
      ticks: {
        font: {
          size: 15,
        },
      },
    },
    y: {
      title: {
        display: true,
        text: 'y Title',
        font: {
          size: 15,
        },
      },
      ticks: {
        font: {
          size: 15,
        },
      },
    },
  },
};

const RADAR_OPTIONS = {
  ...COMMON_OPTIONS,
  scales: {
    r: {
      pointLabels: {
        font: {
          size: 24,
        },
      },
    },
  },
};

const GraphModal = ({ closeModal, uploadGraph }: Props) => {
  const graphRef = useRef<ChartJS>(null);
  const [chartType, setChartType] = useState<keyof typeof CHART_MAP>('pie');
  const [options, setOptions] = useState({
    pie: { ...PIE_OPTIONS },
    line: { ...XY_CHART_OPTION },
    bar: { ...XY_CHART_OPTION },
    radar: { ...RADAR_OPTIONS },
  });
  const [row, setRow] = useState(1);
  const [col, setCol] = useState(5);
  const [data, setData] = useState<number[][]>(
    Array(row).fill(Array(col).fill(0))
  );
  const [labels, setLabels] = useState<string[]>(
    Array.from(Array(col), (_, i) => `Label ${i + 1}`)
  );
  const [items, setItems] = useState<string[]>(
    Array.from(Array(row), (_, i) => `Item ${i + 1}`)
  );
  const [colors, setColors] = useState<string[]>(
    Array(row).fill(genRandomColor())
  );
  const prevChart = useRef(chartType);

  const setOptionByChartType = (option: any) => {
    const newOptions = { ...options };
    newOptions[chartType] = option;
    setOptions(newOptions);
  };

  useEffect(() => {
    if (chartType === 'pie') {
      setRow(1);
      setColors((prev) =>
        Array.from(Array(col), (_, i) => prev[i] || genRandomColor())
      );
    } else if (prevChart.current === 'pie') {
      setColors((prev) =>
        Array.from(Array(row), (_, i) => prev[i] || genRandomColor())
      );
    }
    prevChart.current = chartType;
  }, [chartType]);

  useEffect(() => {
    setData((prev) => {
      const newData = Array.from(Array(row), () => Array(col).fill(0));
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          newData[i][j] = prev[i]?.[j] || 0;
        }
      }
      return newData;
    });
    setLabels((prev) =>
      Array.from(Array(col), (_, i) => prev[i] || `Label ${i + 1}`)
    );
    setItems((prev) =>
      Array.from(Array(row), (_, i) => prev[i] || `Item ${i + 1}`)
    );
    setColors((prev) =>
      Array.from(
        Array(chartType === 'pie' ? col : row),
        (_, i) => prev[i] || genRandomColor()
      )
    );
  }, [row, col]);

  const setXYChartTitle = (axis: 'x' | 'y', title: string) => {
    const newOptions = { ...options };
    const newXYOptions = { ...newOptions[chartType as 'bar' | 'line'] };
    newXYOptions.scales[axis].title.text = title;
    newOptions.bar = newOptions.line = newXYOptions;
    setOptions(newOptions);
  };

  const getXYChartTitle = () => {
    if (chartType !== 'bar' && chartType !== 'line') {
      return { x: '', y: '' };
    } else {
      return {
        x: options[chartType].scales.x.title.text,
        y: options[chartType].scales.y.title.text,
      };
    }
  };

  const getDatasets = () => {
    const datasets = [];
    if (chartType === 'pie') {
      datasets.push({
        data: data[0],
        backgroundColor: colors.map((c) => `${c}33`),
        borderColor: colors,
        borderWidth: 1,
      });
    } else {
      for (let i = 0; i < row; i++) {
        const _color = colors[i] ?? genRandomColor();
        datasets.push({
          label: items[i] || `Item ${i + 1}`,
          data: data[i]?.map((v) => Number(v)) || Array(col).fill(0),
          backgroundColor: `${_color}33`,
          borderColor: _color,
          borderWidth: 1,
        });
      }
    }
    return {
      datalabels: {
        fontSize: 50,
      },
      pointLabels: {
        fontSize: 40,
      },
      datasets,
      labels,
    };
  };

  const upload = () => {
    uploadGraph(graphRef.current?.canvas.toDataURL() as string);
    closeModal();
  };

  return (
    <div className="flex max-w-screen-2xl gap-x-4 rounded-md bg-white p-4">
      {Object.keys(CHART_MAP).map((chartName) => {
        if (chartName !== chartType) return <Fragment key={chartName} />;
        const Chart = CHART_MAP[chartName as keyof typeof CHART_MAP];
        return (
          <Chart
            key={chartName}
            className="my-auto"
            // @ts-ignore
            ref={graphRef}
            data={getDatasets()}
            // @ts-ignore
            options={options[chartName]}
            width={600}
            height={500}
          />
        );
      })}
      <div className="flex flex-col gap-y-5">
        <div>
          {Object.keys(CHART_MAP).map((chartName) => (
            <button
              className={`mx-2 w-20 rounded-md border-2 border-primary-200 py-1 ${
                chartName === chartType
                  ? 'bg-primary-200'
                  : 'hover:bg-primary-100'
              }`}
              key={chartName}
              onClick={() => setChartType(chartName as keyof typeof CHART_MAP)}
            >
              {chartName}
            </button>
          ))}
        </div>
        <DataTable
          type={chartType}
          row={row}
          col={col}
          data={data}
          labels={labels}
          items={items}
          colors={colors}
          setRow={setRow}
          setCol={setCol}
          setData={setData}
          setLabels={setLabels}
          setItems={setItems}
          setColors={setColors}
          setXYChartTitle={setXYChartTitle}
          xyChartTitle={getXYChartTitle()}
        />
        <OptionSelector
          type={chartType}
          options={options[chartType]}
          setOptions={setOptionByChartType}
        />
        <div className="flex-1" />
        <div className="flex h-10 w-full justify-end gap-4">
          <button
            className="w-20 rounded-md bg-gray-200 hover:bg-gray-400"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="w-20 rounded-md bg-primary-200 hover:bg-primary-400"
            onClick={upload}
          >
            Append
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphModal;
