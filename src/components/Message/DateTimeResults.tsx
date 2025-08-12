/**
 * DateTimeResults Component
 * 
 * Displays datetime tool calculation results in a user-friendly format
 */
import React from 'react';
import { DateTimeOutput } from './types';

interface DateTimeResultsProps {
  data: DateTimeOutput;
}

export function DateTimeResults({ data }: DateTimeResultsProps) {
  const { success, result, error, operation, timestamp } = data;

  if (!success) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-700">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              DateTime Calculation Error
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p><strong>Operation:</strong> {operation}</p>
              <p><strong>Error:</strong> {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getOperationLabel = (op: string): string => {
    const operationLabels: Record<string, string> = {
      getCurrentDate: '获取当前日期',
      getCurrentTime: '获取当前时间', 
      getCurrentDateTime: '获取当前日期时间',
      parseDate: '解析日期',
      formatDate: '格式化日期',
      addTime: '添加时间',
      subtractTime: '减少时间',
      diffTime: '计算时间差',
      isAfter: '日期比较（之后）',
      isBefore: '日期比较（之前）',
      isSame: '日期比较（相同）',
      getTimezone: '获取时区',
      convertTimezone: '转换时区',
      getWeekday: '获取星期',
      isWeekend: '判断周末',
      getDaysInMonth: '获取月份天数',
      getStartOfWeek: '获取周开始',
      getEndOfWeek: '获取周结束',
      getRelativeTime: '获取相对时间'
    };
    return operationLabels[op] || op;
  };

  const getOperationIcon = (op: string): React.JSX.Element => {
    // Different icons for different operation types
    if (op.includes('current') || op.includes('now')) {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
    if (op.includes('add') || op.includes('subtract')) {
      return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      );
    }
    if (op.includes('compare') || op.includes('is')) {
      return (
        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    // Default calendar icon
    return (
      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="p-4 border border-blue-300 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getOperationIcon(operation)}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {getOperationLabel(operation)}
          </h3>
          <div className="mt-2">
            <div className="text-lg font-mono text-blue-900 dark:text-blue-100 bg-white dark:bg-gray-800 px-3 py-2 rounded border">
              {result}
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
            计算时间: {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}