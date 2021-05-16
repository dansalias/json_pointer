[![test](https://github.com/dansalias/json_pointer/actions/workflows/test.yml/badge.svg)](https://github.com/dansalias/json_pointer/actions/workflows/test.yml)

Complete implementation of __JSON Pointer__ for __Deno__, as per IETF
[RFC6901](https://datatracker.ietf.org/doc/html/rfc6901)

## Usage
```ts
import * as jp from 'https://deno.land/x/json_pointer/mod.ts'

const obj = {
  'foo': ['bar', 'baz'],
  'qux': { 'quux': 'quuz' },
}

// jp.get(obj: object, pointer: string): any
jp.get(obj, '/foo/0')           // 'bar'
jp.get(obj, '/qux/quux')        // 'quuz'
jp.get(obj, '/hello')           // undefined

// jp.set(obj: object, pointer: string, value: any): void
jp.set(obj, '/foo/1', 'becue')  // obj.foo === ['bar', 'becue']
jp.set(obj, '/foo/-', 'bax')    // obj.foo === ['bar', 'becue', 'bax']
jp.set(obj, '/new/path', 'val') // obj.new === { path: 'val' }
```

## Testing
```
git clone https://github.com/dansalias/json_pointer
cd ./json_pointer
deno test
```
