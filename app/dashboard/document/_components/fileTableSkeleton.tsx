import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const FileTableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
              <Skeleton className="h-4 w-3/4" />
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
              <Skeleton className="h-4 w-3/4" />
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
              <Skeleton className="h-4 w-3/4" />
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
              <Skeleton className="h-4 w-3/4" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 border-b border-gray-300">
                <Skeleton className="h-4 w-3/4" />
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <Skeleton className="h-4 w-3/4" />
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <Skeleton className="h-4 w-3/4" />
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <Skeleton className="h-4 w-3/4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
