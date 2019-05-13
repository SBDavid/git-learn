interface Fetcher {
  getObject(done: (data: any, elapsedTime: number) => void): void;
}

var test: Fetcher = {
  getObject: (call: (data: any, elapsedTime: number) => void) => {
    
  }
}

test.getObject((data) => {})