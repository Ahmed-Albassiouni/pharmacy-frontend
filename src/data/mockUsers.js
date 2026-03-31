export const mockUsers = [
  {
    id: 'u-2001',
    name: 'Mohamed Ali',
    email: 'mohamed.ali@example.com',
    phone: '+20 100 234 9871',
    status: 'active',
    ordersCount: 4,
    addresses: [
      'Nasr City, Cairo, Building 22',
      'Smouha, Alexandria, Apartment 5',
    ],
    favorites: ['p-1001', 'p-1003', 'p-1010'],
  },
  {
    id: 'u-2002',
    name: 'Nour Tarek',
    email: 'nour.tarek@example.com',
    phone: '+20 111 332 4445',
    status: 'active',
    ordersCount: 2,
    addresses: ['Sheikh Zayed, Giza, Villa 14'],
    favorites: ['p-1004', 'p-1007'],
  },
  {
    id: 'u-2003',
    name: 'Hussein Mahmoud',
    email: 'hussein.mahmoud@example.com',
    phone: '+20 122 987 5521',
    status: 'blocked',
    ordersCount: 1,
    addresses: ['Mansoura, Dakahlia, Street 18'],
    favorites: ['p-1002'],
  },
  {
    id: 'u-2004',
    name: 'Farah Salah',
    email: 'farah.salah@example.com',
    phone: '+20 109 234 7744',
    status: 'active',
    ordersCount: 6,
    addresses: ['New Cairo, Fifth Settlement, Building 77'],
    favorites: ['p-1005', 'p-1006', 'p-1012'],
  },
];

export const currentUserId = 'u-2001';
