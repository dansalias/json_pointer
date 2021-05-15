import { assertEquals } from 'https://deno.land/std@0.96.0/testing/asserts.ts'
import * as jsonPointer from './mod.ts'

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
  ["/nowhere",     undefined],
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
  const clone = { ...object }
  Deno.test(`set "${pointer}"`, () => {
    jsonPointer.set(clone, pointer, 'new'),
    assertEquals(
      jsonPointer.get(clone, pointer),
      'new'
    )
  })
}
