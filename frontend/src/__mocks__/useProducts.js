const mockProducts = [
  {
    _id: "mockProductId1",
    accountId: "mockAccountId1",
    name: "Mock Product 1",
    description: "Mock Product Description 1",
    category: "Mock Category 1",
    price: 24.99,
    quantity: 10,
  },
];

const mockProductOwner = {
  _id: "mockUserId1",
  name: "Mock User Name 1",
  email: "mock1@example.com",
  role: "mockRole1",
  isVerified: true,
};

const mockError = new Error("Mock Error");

const mockedUseProducts = () => ({
  products: mockProducts,
  getProducts: jest.fn(),
  getProductById: jest.fn().mockImplementation((productId) => {
    return mockProducts.find((product) => product._id === productId) || null;
  }),
  getProductOwner: jest.fn().mockReturnValue(mockProductOwner),
  updateProduct: jest.fn().mockResolvedValue({ status: 200, error: null }),
  getProductsByCategory: jest.fn().mockResolvedValue(mockProducts),
  loading: false,
  error: mockError,
  findProductOwner: jest.fn().mockResolvedValue(mockProductOwner),
  productOwner: mockProductOwner,
});

export default mockedUseProducts;
