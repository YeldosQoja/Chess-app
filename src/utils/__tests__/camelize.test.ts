import { camelize } from "../camelize";

test("camelize object keys recursively", () => {
  const obj1 = {
    first_name: "John",
    last_name: "Doe",
    address: {
      street_address: "1234 Elm St",
      city: "Springfield",
      state: "IL",
      zip_code: "62701",
    },
  };

  expect(camelize(obj1)).toStrictEqual({
    firstName: "John",
    lastName: "Doe",
    address: {
      streetAddress: "1234 Elm St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
    },
  });

  // Test the object that has an array field with objects using snake_case keys
  const obj2 = {
    first_name: "John",
    last_name: "Doe",
    addresses: [
      {
        street_address: "1234 Elm St",
        city: "Springfield",
        state: "IL",
        zip_code: "62701",
      },
      {
        street_address: "5678 Oak St",
        city: "Springfield",
        state: "IL",
        zip_code: "62702",
      },
    ],
  };

  expect(camelize(obj2)).toStrictEqual({
    firstName: "John",
    lastName: "Doe",
    addresses: [
      {
        streetAddress: "1234 Elm St",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
      },
      {
        streetAddress: "5678 Oak St",
        city: "Springfield",
        state: "IL",
        zipCode: "62702",
      },
    ],
  });
});
