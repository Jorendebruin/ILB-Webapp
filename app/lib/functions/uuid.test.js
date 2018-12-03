import { uuid } from './uuid';

it("should generate an UUID", () => {
  let id = uuid();
  let id2 = uuid()

  expect(id).toHaveLength(36);

  expect(id).not.toEqual(id2);
});
