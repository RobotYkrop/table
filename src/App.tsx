import { useState } from "react";
import Select from "react-select";

const allOptionsInitial = [
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

const App = () => {
  const [rowCount, setRowCount] = useState<any>(1);
  const [tableData, setTableData] = useState<any>([
    { col1: "", col2: "", col3: "", col4: "", col5: "" },
  ]);
  const [allOptions, setAllOptions] = useState(allOptionsInitial);

  const handleCellChange = (rowIndex: number, colIndex: any, value: string) => {
    const updatedTableData = tableData.map((row: any, index: number) => {
      if (index === rowIndex) {
        return { ...row, [`col${colIndex}`]: value };
      }
      return row;
    });
    setTableData(updatedTableData);
  };

  const handleAddOption = (parentValue: any, newValue: any) => {
    const newOption = {
      id: newValue,
      name: newValue,
      parent: parentValue,
    };
    return newOption;
  };

  const renderOptionsForColumn = (rowIndex: any, colIndex: any, parentValue: any) => {
    const filteredOptions = allOptions.filter(option => option.parent === parentValue);
    const options = filteredOptions.map(option => ({ value: option.id, label: option.name }));
  
    // Проверяем наличие отфильтрованных значений
    const hasFilteredOptions = filteredOptions.length > 0;
    console.log(filteredOptions)
    // Добавляем опцию "Добавить значение" только если нет отфильтрованных значений
    if (!hasFilteredOptions) {
      options.push({ value: 'addNewOption', label: 'Добавить значение' });
    }
  
    return (
      <Select
        value={tableData[rowIndex] ? { value: tableData[rowIndex][`col${colIndex}`], label: tableData[rowIndex][`col${colIndex}`] } : null}
        onChange={(selectedOption) => {
          const newValue = selectedOption ? selectedOption.value : '';
  
          // Если выбрана опция "Добавить значение", предложим ввести новое значение
          if (newValue === 'addNewOption') {
            const userInput = window.prompt('Введите новое значение:');
            if (userInput) {
              const newOption = handleAddOption(parentValue, userInput);
              setAllOptions(prevOptions => [...prevOptions, newOption]);
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

  const renderRow = (row: any, rowIndex: any) => (
    <tr key={rowIndex}>
      {[1, 2, 3, 4, 5].map((colIndex) => (
        <td key={colIndex}>
          {colIndex === 1
            ? renderOptionsForColumn(rowIndex, colIndex, null)
            : renderOptionsForColumn(
                rowIndex,
                colIndex,
                tableData[rowIndex][`col${colIndex - 1}`]
              )}
        </td>
      ))}
    </tr>
  );

  const handleAddRow = () => {
    setTableData((prevTableData: any) => {
      let newRows = [];
      for (let i = 0; i < rowCount; i++) {
        newRows.push({ col1: "", col2: "", col3: "", col4: "", col5: "" });
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
        onChange={(event) => setRowCount(event.target.value)}
      />
      <button onClick={handleAddRow}>Добавить {rowCount} строки</button>
      <table>
        <tbody>
          {tableData.map((row: any, index: number) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
