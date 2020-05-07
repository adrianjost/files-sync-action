import { encrypt } from "../src/utils";

const key = "HRkzRZD1+duhfvNvY8eiCPb+ihIjbvkvRyiehJCs8Vc=";

test("encrypt should return a value", () => {
	expect(encrypt("baz", key)).toBeTruthy();
});
