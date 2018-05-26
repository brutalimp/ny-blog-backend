class Logger {

   constructor() {
      this.logWriter = new ConsoleLogWriter();
   }
   info(message) {
    this.logWriter.info(message);
   }

   warn(message) {
       this.logWriter.warn(message);
   }
   
   error(message) {
       this.logWriter.error(message);
   }
}

class ConsoleLogWriter {
    info(message) {
      console.log('INFO: '+ message);
    }
    warn(message) {
        console.warn('WARN: '+ message);
    }
    error(message) {
        console.error('ERROR: '+ message);
    }
}

module.exports = new Logger();