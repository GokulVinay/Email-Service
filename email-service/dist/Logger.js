"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    log(message) {
        console.log(`[INFO] \${message}\`);
  }

  error(message: string): void {
    console.error(\`[ERROR] \${message}\`);
  }
}
        );
    }
}
exports.Logger = Logger;
