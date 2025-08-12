/**
 * DateTime Tool using dayjs
 * 
 * This tool provides accurate date and time calculations for AI use.
 * It helps ensure date calculations are accurate and reduces error rates
 * compared to relying on AI's built-in date understanding.
 */
import { tool } from 'ai';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Define the operation types
export const datetimeOperations = [
  'getCurrentDate',
  'getCurrentTime', 
  'getCurrentDateTime',
  'parseDate',
  'formatDate',
  'addTime',
  'subtractTime',
  'diffTime',
  'isAfter',
  'isBefore',
  'isSame',
  'getTimezone',
  'convertTimezone',
  'getWeekday',
  'isWeekend',
  'getDaysInMonth',
  'getStartOfWeek',
  'getEndOfWeek',
  'getRelativeTime'
] as const;


export const datetimeTool = tool({
  description: 'Perform complex date and time calculations that require precision. Use this tool ONLY for advanced operations like timezone conversion, exact duration calculations, or complex date formatting - NOT for simple date parsing or basic relative dates.',
  inputSchema: z.object({
    operation: z.enum(datetimeOperations).describe('The type of date/time operation to perform'),
    
    // Input parameters
    inputDate: z.string().optional().describe('Input date string (supports various formats: YYYY-MM-DD, MM/DD/YYYY, etc.)'),
    inputTime: z.string().optional().describe('Input time string (HH:mm, HH:mm:ss, etc.)'),
    inputDateTime: z.string().optional().describe('Input datetime string (ISO format preferred)'),
    
    // Format parameters
    inputFormat: z.string().optional().describe('Format of the input date/time string (dayjs format tokens)'),
    outputFormat: z.string().optional().describe('Desired output format (default: YYYY-MM-DD for dates, HH:mm:ss for times, YYYY-MM-DD HH:mm:ss for datetimes)'),
    
    // Calculation parameters
    amount: z.number().optional().describe('Amount to add/subtract (positive or negative)'),
    unit: z.enum(['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond']).optional().describe('Time unit for calculations'),
    
    // Comparison parameters
    compareDate: z.string().optional().describe('Date to compare with'),
    compareDateFormat: z.string().optional().describe('Format of the comparison date'),
    
    // Timezone parameters
    timezone: z.string().optional().describe('Target timezone (e.g., Asia/Shanghai, America/New_York, UTC)'),
    fromTimezone: z.string().optional().describe('Source timezone for conversion')
  }),
  execute: async (params): Promise<{
    success: boolean;
    result?: string;
    error?: string;
    operation: string;
    timestamp: string;
  }> => {
    console.log("Executing datetime tool with operation:", params.operation, "params:", params);
    
    try {
      let result: string;
      const now = dayjs();
      
      switch (params.operation) {
        case 'getCurrentDate':
          result = now.format(params.outputFormat || 'YYYY-MM-DD');
          break;
          
        case 'getCurrentTime':
          result = now.format(params.outputFormat || 'HH:mm:ss');
          break;
          
        case 'getCurrentDateTime':
          result = now.format(params.outputFormat || 'YYYY-MM-DD HH:mm:ss');
          break;
          
        case 'parseDate':
          if (!params.inputDate) {
            throw new Error('inputDate is required for parseDate operation');
          }
          const parsedDate = params.inputFormat 
            ? dayjs(params.inputDate, params.inputFormat)
            : dayjs(params.inputDate);
          if (!parsedDate.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate}`);
          }
          result = parsedDate.format(params.outputFormat || 'YYYY-MM-DD');
          break;
          
        case 'formatDate':
          if (!params.inputDate && !params.inputDateTime) {
            throw new Error('inputDate or inputDateTime is required for formatDate operation');
          }
          const dateToFormat = params.inputFormat
            ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
            : dayjs(params.inputDate || params.inputDateTime);
          if (!dateToFormat.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          result = dateToFormat.format(params.outputFormat || 'YYYY-MM-DD HH:mm:ss');
          break;
          
        case 'addTime':
          if (!params.amount || !params.unit) {
            throw new Error('amount and unit are required for addTime operation');
          }
          const baseDate = params.inputDate || params.inputDateTime 
            ? (params.inputFormat 
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!baseDate.isValid()) {
            throw new Error(`Invalid base date: ${params.inputDate || params.inputDateTime}`);
          }
          const addedDate = baseDate.add(params.amount, params.unit);
          result = addedDate.format(params.outputFormat || 'YYYY-MM-DD HH:mm:ss');
          break;
          
        case 'subtractTime':
          if (!params.amount || !params.unit) {
            throw new Error('amount and unit are required for subtractTime operation');
          }
          const baseDateForSub = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!baseDateForSub.isValid()) {
            throw new Error(`Invalid base date: ${params.inputDate || params.inputDateTime}`);
          }
          const subtractedDate = baseDateForSub.subtract(params.amount, params.unit);
          result = subtractedDate.format(params.outputFormat || 'YYYY-MM-DD HH:mm:ss');
          break;
          
        case 'diffTime':
          if (!params.compareDate) {
            throw new Error('compareDate is required for diffTime operation');
          }
          const date1 = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          const date2 = params.compareDateFormat
            ? dayjs(params.compareDate, params.compareDateFormat)
            : dayjs(params.compareDate);
          if (!date1.isValid() || !date2.isValid()) {
            throw new Error('Invalid dates for comparison');
          }
          const diff = date1.diff(date2, params.unit || 'day');
          result = `${diff} ${params.unit || 'day'}(s)`;
          break;
          
        case 'isAfter':
          if (!params.compareDate) {
            throw new Error('compareDate is required for isAfter operation');
          }
          const dateA = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          const dateB = params.compareDateFormat
            ? dayjs(params.compareDate, params.compareDateFormat)
            : dayjs(params.compareDate);
          if (!dateA.isValid() || !dateB.isValid()) {
            throw new Error('Invalid dates for comparison');
          }
          result = dateA.isAfter(dateB, params.unit).toString();
          break;
          
        case 'isBefore':
          if (!params.compareDate) {
            throw new Error('compareDate is required for isBefore operation');
          }
          const dateC = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          const dateD = params.compareDateFormat
            ? dayjs(params.compareDate, params.compareDateFormat)
            : dayjs(params.compareDate);
          if (!dateC.isValid() || !dateD.isValid()) {
            throw new Error('Invalid dates for comparison');
          }
          result = dateC.isBefore(dateD, params.unit).toString();
          break;
          
        case 'isSame':
          if (!params.compareDate) {
            throw new Error('compareDate is required for isSame operation');
          }
          const dateE = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          const dateF = params.compareDateFormat
            ? dayjs(params.compareDate, params.compareDateFormat)
            : dayjs(params.compareDate);
          if (!dateE.isValid() || !dateF.isValid()) {
            throw new Error('Invalid dates for comparison');
          }
          result = dateE.isSame(dateF, params.unit).toString();
          break;
          
        case 'getTimezone':
          result = dayjs.tz.guess(); // Get user's timezone
          break;
          
        case 'convertTimezone':
          if (!params.timezone) {
            throw new Error('timezone is required for convertTimezone operation');
          }
          const dateForTz = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!dateForTz.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          const convertedDate = params.fromTimezone
            ? dayjs.tz(dateForTz.format(), params.fromTimezone).tz(params.timezone)
            : dateForTz.tz(params.timezone);
          result = convertedDate.format(params.outputFormat || 'YYYY-MM-DD HH:mm:ss z');
          break;
          
        case 'getWeekday':
          const dateForWeekday = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!dateForWeekday.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          result = dateForWeekday.format('dddd'); // Full weekday name
          break;
          
        case 'isWeekend':
          const dateForWeekendCheck = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!dateForWeekendCheck.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          const dayOfWeek = dateForWeekendCheck.day();
          result = (dayOfWeek === 0 || dayOfWeek === 6).toString(); // Sunday = 0, Saturday = 6
          break;
          
        case 'getDaysInMonth':
          const dateForDaysInMonth = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!dateForDaysInMonth.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          result = dateForDaysInMonth.daysInMonth().toString();
          break;
          
        case 'getStartOfWeek':
          const dateForStartOfWeek = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!dateForStartOfWeek.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          result = dateForStartOfWeek.startOf('week').format(params.outputFormat || 'YYYY-MM-DD');
          break;
          
        case 'getEndOfWeek':
          const dateForEndOfWeek = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!dateForEndOfWeek.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          result = dateForEndOfWeek.endOf('week').format(params.outputFormat || 'YYYY-MM-DD');
          break;
          
        case 'getRelativeTime':
          const dateForRelative = params.inputDate || params.inputDateTime
            ? (params.inputFormat
                ? dayjs(params.inputDate || params.inputDateTime, params.inputFormat)
                : dayjs(params.inputDate || params.inputDateTime))
            : now;
          if (!dateForRelative.isValid()) {
            throw new Error(`Invalid date: ${params.inputDate || params.inputDateTime}`);
          }
          const compareWith = params.compareDate
            ? (params.compareDateFormat
                ? dayjs(params.compareDate, params.compareDateFormat)
                : dayjs(params.compareDate))
            : now;
          result = dateForRelative.from(compareWith);
          break;
          
        default:
          throw new Error(`Unknown operation: ${params.operation}`);
      }
      
      return {
        success: true,
        result,
        operation: params.operation,
        timestamp: now.toISOString()
      };
      
    } catch (error) {
      console.error('DateTime tool error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        operation: params.operation,
        timestamp: dayjs().toISOString()
      };
    }
  }
});