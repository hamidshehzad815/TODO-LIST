import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf } = format;

// Define custom log format
const customFormat = printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
);

// Create the logger
const logger = createLogger({
  format: combine(timestamp(), customFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
    }),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
    }),
  ],
});

export default logger;
