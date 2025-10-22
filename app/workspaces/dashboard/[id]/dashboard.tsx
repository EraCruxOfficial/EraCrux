"use client";
import { useEffect, useState } from "react";
import { parseAndCleanCSV } from "@/lib/csv";
// import KPI from "@/components/KPI";
import UniversalAreaChart from "@/components/charts/area-chart";
import ChartBarMultiple from "@/components/charts/bar-chart";
import CustomPieChart from "@/components/charts/pie-chart";
import ChartRadarDefault from "@/components/charts/radar-chart";
import ChartRadialSimple from "@/components/charts/radial-chart";
import { EmptyInputGroup } from "@/components/ui/empty-page";
// import MapView from "@/components/MapView";

interface FileMetadata {
  id: string;
  filename: string;
  s3Url: string;
  csvContent: string;
  metadata: {
    fileSize: number;
    contentType: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function Dashboard({ id }: { id: string }) {
  const [data, setData] = useState<any[]>([]);
  const [fileInfo, setFileInfo] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch CSV data from our API route
        const res = await fetch(`/api/fetchCsv/${id}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const result = await res.json();

        if (!result.success) {
          throw new Error('API returned unsuccessful response');
        }

        const fileData = result.data;
        setFileInfo(fileData);

        // Parse the CSV content
        const parsed = parseAndCleanCSV(fileData.csvContent);
        console.log("File ID:", id);
        console.log("File Info:", fileData);
        console.log("Parsed Data:", parsed);

        setData(parsed);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <EmptyInputGroup />
      </div>

    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>No data available in CSV file</p>
      </div>
    );
  }


  return (
    <div className="space-y-6 p-4 w-full max-w-7xl mx-auto">
      {/* Header with file info */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{fileInfo?.filename ?? "Dashboard"}</h2>
        {fileInfo && (
          <div className="mt-2 text-sm text-muted-foreground">
            {/* <p>File: {fileInfo.filename}</p> */}
            <p>Size: {(fileInfo.metadata.fileSize / 1024).toFixed(2)} KB</p>
            <p>Uploaded: {new Date(fileInfo.metadata.createdAt).toLocaleDateString()}</p>
            <p className="text-xs">Rows: {data.length}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Area chart spanning full width */}
        <div className="w-full">
          <UniversalAreaChart
            data={data}
            title="📊 Area Performance Analytics"
            height={400}
          />
        </div>

        {/* Bar charts in a row below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartBarMultiple data={data} />
          <CustomPieChart data={data} showPercentages={false} />
          <ChartRadarDefault data={data} />
          <ChartRadialSimple data={data} />
        </div>
      </div>
    </div>
  );
}