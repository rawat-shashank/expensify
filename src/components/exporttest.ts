//// components/ExportDataComponent.tsx
//import React from 'react';
//import { useSQLiteContext } from 'expo-sqlite';
//import { useExportData } from '../hooks/useExportData'; // Adjust path
//
//const ExportDataComponent: React.FC = () => {
//  const db = useSQLiteContext();
//  const { exportedData, isExporting, exportError, triggerExport } = useExportData(db);
//
//  const handleExportClick = async () => {
//    await triggerExport();
//  };
//
//  const downloadJson = (data: any) => {
//    if (!data) return;
//
//    const jsonString = JSON.stringify(data, null, 2); // Pretty print JSON
//    const blob = new Blob([jsonString], { type: 'application/json' });
//    const url = URL.createObjectURL(blob);
//
//    const a = document.createElement('a');
//    a.href = url;
//    a.download = 'exported_finance_data.json';
//    document.body.appendChild(a);
//    a.click();
//    document.body.removeChild(a);
//    URL.revokeObjectURL(url); // Clean up the URL object
//  };
//
//  React.useEffect(() => {
//    // Automatically trigger download if data is available after export
//    if (exportedData && !isExporting && !exportError) {
//      downloadJson(exportedData);
//      alert('Data exported successfully!');
//    }
//  }, [exportedData, isExporting, exportError]);
//
//  return (
//    <div>
//      <h2>Export All Data</h2>
//      <button onClick={handleExportClick} disabled={isExporting}>
//        {isExporting ? 'Exporting...' : 'Export Data to JSON'}
//      </button>
//
//      {exportError && (
//        <p style={{ color: 'red' }}>Error exporting data: {exportError.message}</p>
//      )}
//
//      {/* Optionally display the data if you want to see it in the UI */}
//      {/* {exportedData && (
//        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
//          {JSON.stringify(exportedData, null, 2)}
//        </pre>
//      )} */}
//    </div>
//  );
//};
//
//export default ExportDataComponent;
