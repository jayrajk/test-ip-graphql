import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { join } from 'path'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export default createLogger({
  format: format.combine(
    format.json(),
    format.timestamp(),
  ),
  transports: [
    new transports.Console(),
    new (DailyRotateFile)({
      filename: join('./logs', 'backend.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '30m',
      maxFiles: '20d',
    }),
  ],
})
