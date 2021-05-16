import {
  assertEquals,
} from 'https://deno.land/std@0.96.0/testing/asserts.ts'
import * as jsonPointer from './mod.ts'

function createClone(object: object): object {
  return JSON.parse(JSON.stringify(object))
}

function assertDeepEquals<T extends any>(actual: T, expected: T): void {
  assertEquals(
    JSON.stringify(actual),
    JSON.stringify(expected)
  )
  return
}

const object = {
  "foo": ["bar", "baz"],
  "qux": {"quux": "quuz"},
  "": 0,
  "a/b": 1,
  "c%d": 2,
  "e^f": 3,
  "g|h": 4,
  "i\\j": 5,
  "k\"l": 6,
  " ": 7,
  "m~n": 8,
  "o": {"p/q":{"r~s":"t"}},
  "u": ["v", {"w":["x","y"]}],
}

const expectedGets: [string, any][] = [
  ["",             object],
  ["/foo",         ["bar", "baz"]],
  ["/foo/0",       "bar"],
  ["/qux/quux",    "quuz"],
  ["/",            0],
  ["/a~1b",        1],
  ["/c%d",         2],
  ["/e^f",         3],
  ["/g|h",         4],
  ["/i\\j",        5],
  ["/k\"l",        6],
  ["/ ",           7],
  ["/m~0n",        8],
  ["/o/p~1q/r~0s", "t"],
  ["/u/1/w/1",     "y"],
  ["/nowhere",     undefined],
  ["/new/path",    undefined],
]

const expectedSets = expectedGets.slice(1)

for (const [pointer, expected] of expectedGets) {
  Deno.test(`get "${pointer}"`, () => {
    assertEquals(
      jsonPointer.get(object, pointer),
      expected
    )
  })
}

for (const [pointer, expected] of expectedSets) {
  const clone = createClone(object)
  Deno.test(`set "${pointer}"`, () => {
    jsonPointer.set(clone, pointer, 'new')
    assertEquals(
      jsonPointer.get(clone, pointer),
      'new'
    )
  })
}

Deno.test(`set "/foo/-"`, () => {
  const clone = createClone(object)
  jsonPointer.set(clone, '/foo/-', 'bax')
  assertDeepEquals(
    jsonPointer.get(clone, '/foo'),
    ['bar', 'baz', 'bax']
  )
})

Deno.test(`set "/u/1/w/-"`, () => {
  const clone = createClone(object)
  jsonPointer.set(clone, '/u/1/w/-', 'z')
  assertDeepEquals(
    jsonPointer.get(clone, '/u/1/w'),
    ['x', 'y', 'z']
  )
})
