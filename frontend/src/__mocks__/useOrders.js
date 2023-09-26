const mockUser = {
  _id: "mockUserId1",
  name: "Mock User Name",
  email: "mock@example.com",
  role: "mockRole",
  isVerified: true,
};

const mockOrders = [
  {
    _id: "mockOrder1",
    sellerId: "mockUserId1",
    productId: "mockProductId1",
    status: "Pending",
  },
];

const mockedUseOrders = jest.fn().mockImplementation(() => ({
  orders: mockOrders,
  setOrders: jest.fn(),
  updateOrder: jest.fn().mockImplementation((itemToUpdate) => ({
    ...itemToUpdate,
    status: "Fulfilled",
  })),
  getOrderById: jest.fn().mockImplementation((orderID) => {
    return mockOrders.find((order) => order._id === orderID) || null;
  }),
}));

export default mockedUseOrders;
