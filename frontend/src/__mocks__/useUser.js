const mockUser = {
  _id: "mockUserId1",
  name: "Mock User Name",
  email: "mock@example.com",
  role: "mockRole",
  isVerified: true,
};

const mockProduct = {
  accountId: "mockAccountId",
  _id: "mockProductId1",
  name: "Mock Product Name",
  description: "This is a mock product description for testing purposes.",
  category: "Mock Category",
  price: 24.99,
  quantity: 10,
};

const mockedUseUser = () => ({
  user: mockUser,
  setIsLoading: jest.fn(),
  updateUser: jest.fn().mockResolvedValue({ status: 200, error: null }),
  isLoading: false,
  products: [mockProduct],
  setUserProducts: jest.fn(),
  getUserById: jest.fn().mockResolvedValue(mockUser),
  atomicUserUpdate: jest.fn().mockResolvedValue({ status: 200, error: null }),
  getAllUserProducts: jest.fn().mockResolvedValue([mockProduct]),
  allProducts: [mockProduct],
  updateOtherUser: jest.fn().mockResolvedValue({ status: 200, error: null }),
  returnUserProducts: jest.fn().mockResolvedValue([mockProduct]),
});

export default mockedUseUser;
