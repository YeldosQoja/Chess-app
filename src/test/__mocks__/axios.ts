import { AxiosStatic } from "axios";
const actualAxios = jest.requireActual("axios");

const mockedAxiosInstance = {
  get: jest.fn((url, config) => {
    if (url === "profile/") {
      return Promise.resolve({
        data: { id: 1, first_name: "John", last_name: "Doe" },
      });
    }
    return Promise.resolve({ data: {} });
  }),
  //   post: jest.fn((url, config) => {}),
  //   delete: jest.fn((url, config) => {}),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
      clear: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
      clear: jest.fn(),
    },
  },
};

const mockedAxios: AxiosStatic = {
  ...actualAxios,
  create: jest.fn(() => mockedAxiosInstance),
};

export default mockedAxios;
