import React, { useState } from "react";
import Select from "react-select";

interface Option {
  id: string;
  name: string;
  parent: string | null;
}

interface TableData {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
}

const allOptionsInitial: Option[] = [
  { id: "1.1", name: "1.1", parent: null },
  { id: "1.2", name: "1.2", parent: null },
  { id: "2.1", name: "2.1", parent: "1.1" },
  { id: "2.2", name: "2.2", parent: "1.2" },
  { id: "3.1", name: "3.1", parent: "2.1" },
  { id: "3.2", name: "3.2", parent: "2.2" },
  { id: "4.1", name: "4.1", parent: "3.1" },
  { id: "4.2", name: "4.2", parent: "3.2" },
  { id: "5.1", name: "5.1", parent: "4.1" },
  { id: "5.2", name: "5.2", parent: "4.2" },
];

const App: React.FC = () => {
  const [rowCount, setRowCount] = useState<number>(1);
  const [tableData, setTableData] = useState<TableData[]>([
    { col1: "", col2: "", col3: "", col4: "", col5: "" },
  ]);
  const [allOptions, setAllOptions] = useState<Option[]>(allOptionsInitial);

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updatedTableData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [`col${colIndex}` as keyof TableData]: value };
      }
      return row;
    });
    setTableData(updatedTableData);
  };

  const handleAddOption = (parentValue: string, newValue: string): Option => {
    const newOption: Option = {
      id: newValue,
      name: newValue,
      parent: parentValue,
    };
    return newOption;
  };

  const renderOptionsForColumn = (
    rowIndex: number,
    colIndex: number,
    parentValue: string | null
  ) => {
    const filteredOptions = allOptions.filter(
      (option) => option.parent === parentValue
    );
    const options = filteredOptions.map((option) => ({
      value: option.id,
      label: option.name,
    }));

    const hasFilteredOptions = filteredOptions.length > 0;

    if (!hasFilteredOptions) {
      options.push({ value: "addNewOption", label: "Добавить значение" });
    }

    return (
      <Select
        value={
          tableData[rowIndex]
            ? {
                value: tableData[rowIndex][`col${colIndex}` as keyof TableData],
                label: tableData[rowIndex][`col${colIndex}` as keyof TableData],
              }
            : null
        }
        onChange={(selectedOption) => {
          const newValue = selectedOption ? selectedOption.value : "";

          if (newValue === "addNewOption") {
            const userInput = window.prompt("Введите новое значение:");
            if (userInput && parentValue != null) {
              const newOption = handleAddOption(parentValue, userInput);
              setAllOptions((prevOptions) => [...prevOptions, newOption]);
              handleCellChange(rowIndex, colIndex, newOption.id);
            }
          } else {
            handleCellChange(rowIndex, colIndex, newValue);
          }
        }}
        options={options}
        isClearable
        isSearchable
      />
    );
  };

  const renderRow = (row: TableData, rowIndex: number) => (
    <tr key={rowIndex}>
      {[1, 2, 3, 4, 5].map((colIndex) => (
        <td key={colIndex}>
          {colIndex === 1
            ? renderOptionsForColumn(rowIndex, colIndex, null)
            : renderOptionsForColumn(
                rowIndex,
                colIndex,
                tableData[rowIndex][`col${colIndex - 1}` as keyof TableData]
              )}
        </td>
      ))}
    </tr>
  );

  const handleAddRow = () => {
    setTableData((prevTableData) => {
      let newRows = [];
      for (let i = 0; i < rowCount; i++) {
        newRows.push({
          col1: "",
          col2: "",
          col3: "",
          col4: "",
          col5: "",
        });
      }
      return [...prevTableData, ...newRows];
    });
  };

  return (
    <div>
      <button onClick={handleAddRow}>Добавить строку</button>
      <input
        type="number"
        value={rowCount}
        onChange={(event) => setRowCount(parseInt(event.target.value))}
      />
      <button onClick={handleAddRow}>Добавить {rowCount} строки</button>
      <table>
        <tbody>
          {tableData.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  );
};

export default App;