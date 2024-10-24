import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { CameraFeed } from './components/CameraFeed';
import { LineGraph } from './components/LineGraph';
import { ClipboardList } from 'lucide-react';
import { processProductionData, processLineData } from './utils/dataProcessing';
import { ProductionData } from './types';

interface LineStatus {
  partNumber: string;
  partName: string;
  totalQuantity: string;
  partsPerHour: string;
}

function App() {
  const [line1Data, setLine1Data] = useState<LineStatus>({
    partNumber: '-',
    partName: '-',
    totalQuantity: '0',
    partsPerHour: '0'
  });
  const [line2Data, setLine2Data] = useState<LineStatus>({
    partNumber: '-',
    partName: '-',
    totalQuantity: '0',
    partsPerHour: '0'
  });

  const [lineData1, setLineData1] = useState<Array<{ time: string; value: number | null }>>([]);
  const [lineData2, setLineData2] = useState<Array<{ time: string; value: number | null }>>([]);

  const handleFileUpload = (rawData: any[]) => {
    const formattedData = processProductionData(rawData);

    // Process line 1 data
    const line1Entries = formattedData.filter(entry => entry.line === '1');
    if (line1Entries.length > 0) {
      const lastLine1Entry = line1Entries[line1Entries.length - 1];
      setLine1Data({
        partNumber: lastLine1Entry.partNumber || '-',
        partName: lastLine1Entry.partName || '-',
        totalQuantity: lastLine1Entry.totalQuantity || '0',
        partsPerHour: Math.ceil(lastLine1Entry.partsPerHour).toString()
      });

      const line1GraphData = processLineData(line1Entries);
      setLineData1(line1GraphData);
    }

    // Process line 2 data
    const line2Entries = formattedData.filter(entry => entry.line === '2');
    if (line2Entries.length > 0) {
      const lastLine2Entry = line2Entries[line2Entries.length - 1];
      setLine2Data({
        partNumber: lastLine2Entry.partNumber || '-',
        partName: lastLine2Entry.partName || '-',
        totalQuantity: lastLine2Entry.totalQuantity || '0',
        partsPerHour: Math.ceil(lastLine2Entry.partsPerHour).toString()
      });

      const line2GraphData = processLineData(line2Entries);
      setLineData2(line2GraphData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClipboardList className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Decatur MX - Flock Real Time Report</h1>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-2 py-6">
        <div className="grid grid-cols-5 gap-6 h-[calc(100vh-8rem)]">
          <div className="h-full">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[calc(50%-0.75rem)] mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Current Part Line 1</h2>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-500">Part Number</p>
                  <p className="font-medium text-gray-900">{line1Data.partNumber}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Part Name</p>
                  <p className="font-medium text-gray-900">{line1Data.partName}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Total Quantity / Shift</p>
                  <p className="font-medium text-gray-900">{line1Data.totalQuantity}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Parts / Hour</p>
                  <p className="font-medium text-gray-900">{line1Data.partsPerHour}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 h-[calc(50%-0.75rem)]">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Current Part Line 2</h2>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-500">Part Number</p>
                  <p className="font-medium text-gray-900">{line2Data.partNumber}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Part Name</p>
                  <p className="font-medium text-gray-900">{line2Data.partName}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Total Quantity / Shift</p>
                  <p className="font-medium text-gray-900">{line2Data.totalQuantity}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Parts / Hour</p>
                  <p className="font-medium text-gray-900">{line2Data.partsPerHour}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 flex flex-col gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[calc(50%-0.75rem)]">
              <LineGraph title="Line 1 Production Rate" data={lineData1} color="#3B82F6" />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 h-[calc(50%-0.75rem)]">
              <LineGraph title="Line 2 Production Rate" data={lineData2} color="#10B981" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4 flex-[2]">
              <CameraFeed />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 flex-1">
              <div className="h-full flex items-center justify-center rounded-lg" style={{ backgroundColor: '#2E6F40' }}>
                <div className="text-center text-white">
                  <svg width="80" height="80" viewBox="0 0 100 100" className="fill-current">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5"/>
                    <circle cx="35" cy="40" r="5"/>
                    <circle cx="65" cy="40" r="5"/>
                    <path d="M 30 65 Q 50 80 70 65" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;