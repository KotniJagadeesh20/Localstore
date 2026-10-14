export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock' | 'Archived'
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled'

export interface Product { id: string; name: string; sku: string; category: string; price: number; status: ProductStatus; updated: string; emoji: string }
export interface Category { id: string; name: string; description: string; products: number; status: 'Active' | 'Draft' | 'Archived'; updated: string; emoji: string }
export interface Variant { id: string; product: string; variant: string; sku: string; category: string; stock: number; threshold: number; updated: string; emoji: string }
export interface Order { id: string; customer: string; phone: string; email: string; items: { name: string; variant: string; price: number; qty: number; emoji: string }[]; amount: number; payment: 'Paid' | 'Pending'; status: OrderStatus; date: string }
export interface Customer { id: string; name: string; phone: string; email: string; orders: number; spent: number; lastOrder: string; joined: string; tag: 'Returning' | 'New' | 'Inactive' }
export interface Review { id: string; title: string; body: string; type: 'Product' | 'Business'; product: string; variant: string; customer: string; phone: string; rating: number; date: string; order: string; reply?: string }

export const productEmoji: Record<string, string> = { Kaja: '🍘', Ariselu: '🍪', Pootharekulu: '🍥', Murukulu: '🌀', 'Pickle (Mango)': '🫙', Bobbatlu: '🥞', 'Ghaatu Mixture': '🥨', 'Boondi Laddu': '🟠' }

const P = (id: string, name: string, category: string, price: number, status: ProductStatus, updated: string): Product =>
  ({ id, name, sku: `GM${id.padStart(3, '0')}`, category, price, status, updated, emoji: productEmoji[name] ?? '🍬' })

export const products: Product[] = [
  P('1', 'Kaja', 'Sweets', 300, 'Active', 'Sep 22, 2024'),
  P('2', 'Ariselu', 'Sweets', 350, 'Active', 'Sep 21, 2024'),
  P('3', 'Pootharekulu', 'Sweets', 450, 'Active', 'Sep 20, 2024'),
  P('4', 'Murukulu', 'Snacks', 250, 'Active', 'Sep 20, 2024'),
  P('5', 'Pickle (Mango)', 'Pickles', 200, 'Draft', 'Sep 19, 2024'),
  P('6', 'Bobbatlu', 'Sweets', 280, 'Out of Stock', 'Sep 18, 2024'),
  P('7', 'Ghaatu Mixture', 'Snacks', 180, 'Active', 'Sep 18, 2024'),
  P('8', 'Boondi Laddu', 'Sweets', 320, 'Active', 'Sep 17, 2024'),
]

export const categories: Category[] = [
  { id: '1', name: 'Sweets', description: 'Traditional homemade sweets and festive items', products: 8, status: 'Active', updated: 'Sep 22, 2024', emoji: '🍬' },
  { id: '2', name: 'Snacks', description: 'Crunchy and tasty snacks for every occasion', products: 6, status: 'Active', updated: 'Sep 21, 2024', emoji: '🌀' },
  { id: '3', name: 'Pickles', description: 'Homemade pickles with authentic taste', products: 4, status: 'Active', updated: 'Sep 20, 2024', emoji: '🫙' },
  { id: '4', name: 'Special Items', description: 'Gift boxes and special occasions', products: 3, status: 'Draft', updated: 'Sep 19, 2024', emoji: '🎁' },
  { id: '5', name: 'Dry Snacks', description: 'Healthy and traditional dry snacks', products: 5, status: 'Active', updated: 'Sep 18, 2024', emoji: '🥜' },
  { id: '6', name: 'Festival Packs', description: 'Curated packs for festivals and events', products: 2, status: 'Archived', updated: 'Sep 15, 2024', emoji: '📦' },
]

export const variants: Variant[] = [
  { id: 'v1', product: 'Kaja', variant: '250 g', sku: 'GM001-250', category: 'Sweets', stock: 12, threshold: 5, updated: 'Sep 22, 2024', emoji: '🍘' },
  { id: 'v2', product: 'Kaja', variant: '500 g', sku: 'GM001-500', category: 'Sweets', stock: 4, threshold: 5, updated: 'Sep 22, 2024', emoji: '🍘' },
  { id: 'v3', product: 'Kaja', variant: '1 kg', sku: 'GM001-1KG', category: 'Sweets', stock: 0, threshold: 5, updated: 'Sep 21, 2024', emoji: '🍘' },
  { id: 'v4', product: 'Ariselu', variant: '250 g', sku: 'GM002-250', category: 'Sweets', stock: 8, threshold: 5, updated: 'Sep 21, 2024', emoji: '🍪' },
  { id: 'v5', product: 'Ariselu', variant: '500 g', sku: 'GM002-500', category: 'Sweets', stock: 3, threshold: 5, updated: 'Sep 21, 2024', emoji: '🍪' },
  { id: 'v6', product: 'Murukulu', variant: '250 g', sku: 'GM003-250', category: 'Snacks', stock: 24, threshold: 5, updated: 'Sep 20, 2024', emoji: '🌀' },
  { id: 'v7', product: 'Bobbatlu', variant: 'Standard', sku: 'GM004-STD', category: 'Sweets', stock: 0, threshold: 5, updated: 'Sep 20, 2024', emoji: '🥞' },
  { id: 'v8', product: 'Pickle (Mango)', variant: '500 g', sku: 'GM005-500', category: 'Pickles', stock: 15, threshold: 5, updated: 'Sep 19, 2024', emoji: '🫙' },
]

export const stockStatus = (v: { stock: number; threshold: number }) =>
  v.stock === 0 ? 'Out of Stock' : v.stock <= v.threshold ? 'Low Stock' : 'In Stock'

export const stockHistory = [
  { date: 'Sep 22, 2024', delta: -2, note: 'Order #LS1024' },
  { date: 'Sep 20, 2024', delta: -3, note: 'Order #LS1018' },
  { date: 'Sep 18, 2024', delta: 20, note: 'New stock received' },
  { date: 'Sep 15, 2024', delta: -1, note: 'Manual adjustment' },
]

const it = (name: string, variant: string, price: number, qty: number) => ({ name, variant, price, qty, emoji: productEmoji[name] ?? '🍬' })
export const orders: Order[] = [
  { id: 'LS1024', customer: 'Ravi Kumar', phone: '+91 98765 43210', email: 'ravi.kumar@email.com', items: [it('Kaja', '500 g', 300, 2), it('Ariselu', '250 g', 150, 1)], amount: 750, payment: 'Paid', status: 'Processing', date: 'Today, 10:32 AM' },
  { id: 'LS1023', customer: 'Priya Sharma', phone: '+91 91234 56789', email: 'priya@gmail.com', items: [it('Kaja', '250 g', 150, 1), it('Ariselu', '500 g', 300, 1)], amount: 450, payment: 'Paid', status: 'Confirmed', date: 'Today, 09:15 AM' },
  { id: 'LS1022', customer: 'Arjun Reddy', phone: '+91 99887 66554', email: 'arjun.reddy@gmail.com', items: [it('Murukulu', '250 g', 250, 2), it('Pickle (Mango)', '500 g', 200, 2)], amount: 900, payment: 'Paid', status: 'Packed', date: 'Sep 22, 2024, 06:20 PM' },
  { id: 'LS1021', customer: 'Suresh Babu', phone: '+91 90123 45678', email: 'suresh@gmail.com', items: [it('Pickle (Mango)', '500 g', 350, 1)], amount: 350, payment: 'Paid', status: 'Shipped', date: 'Sep 21, 2024, 04:18 PM' },
  { id: 'LS1020', customer: 'Meena Reddy', phone: '+91 88995 22334', email: 'meena@gmail.com', items: [it('Pootharekulu', '6 pcs', 450, 1), it('Pickle (Mango)', '500 g', 150, 1)], amount: 600, payment: 'Paid', status: 'Delivered', date: 'Sep 20, 2024, 11:10 AM' },
  { id: 'LS1019', customer: 'Vikram Naidu', phone: '+91 93456 77890', email: 'vikram@gmail.com', items: [it('Kaja', '500 g', 300, 2), it('Murukulu', '250 g', 220, 1)], amount: 820, payment: 'Pending', status: 'Pending', date: 'Sep 20, 2024, 09:45 AM' },
  { id: 'LS1018', customer: 'Anusha Reddy', phone: '+91 99876 54321', email: 'anusha@gmail.com', items: [it('Bobbatlu', 'Standard', 280, 1)], amount: 280, payment: 'Paid', status: 'Cancelled', date: 'Sep 19, 2024, 07:30 PM' },
  { id: 'LS1017', customer: 'Ramesh K', phone: '+91 91230 44556', email: 'ramesh@gmail.com', items: [it('Murukulu', '250 g', 260, 2)], amount: 520, payment: 'Paid', status: 'Delivered', date: 'Sep 18, 2024, 01:12 PM' },
]
export const orderFlow: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered']
export const orderCounts: Record<string, number> = { All: 42, Pending: 4, Confirmed: 6, Processing: 8, Packed: 5, Shipped: 7, Delivered: 10, Cancelled: 2 }

export const customers: Customer[] = [
  { id: '1', name: 'Ravi Kumar', phone: '+91 98765 43210', email: 'ravi@gmail.com', orders: 8, spent: 4250, lastOrder: 'Today 10:32 AM', joined: 'Sep 10, 2024', tag: 'Returning' },
  { id: '2', name: 'Priya Sharma', phone: '+91 91234 56789', email: 'priya@gmail.com', orders: 5, spent: 2800, lastOrder: 'Yesterday 06:15 PM', joined: 'Sep 12, 2024', tag: 'Returning' },
  { id: '3', name: 'Arjun Reddy', phone: '+91 99887 66554', email: 'arjun.reddy@gmail.com', orders: 3, spent: 1450, lastOrder: 'Sep 20, 2024 11:20 AM', joined: 'Sep 15, 2024', tag: 'Returning' },
  { id: '4', name: 'Suresh Babu', phone: '+91 90123 45678', email: 'suresh@gmail.com', orders: 1, spent: 350, lastOrder: 'Sep 18, 2024 04:18 PM', joined: 'Sep 18, 2024', tag: 'New' },
  { id: '5', name: 'Meena Reddy', phone: '+91 88995 22334', email: 'meena@gmail.com', orders: 6, spent: 3150, lastOrder: 'Sep 19, 2024 02:45 PM', joined: 'Sep 14, 2024', tag: 'Returning' },
  { id: '6', name: 'Vikram Naidu', phone: '+91 93456 77890', email: 'vikram@gmail.com', orders: 2, spent: 980, lastOrder: 'Sep 17, 2024 07:30 PM', joined: 'Sep 16, 2024', tag: 'Inactive' },
  { id: '7', name: 'Anusha Reddy', phone: '+91 99876 54321', email: 'anusha@gmail.com', orders: 4, spent: 2200, lastOrder: 'Sep 18, 2024 11:10 AM', joined: 'Sep 11, 2024', tag: 'Returning' },
  { id: '8', name: 'Ramesh K', phone: '+91 91230 44556', email: 'ramesh@gmail.com', orders: 1, spent: 520, lastOrder: 'Sep 16, 2024 01:12 PM', joined: 'Sep 16, 2024', tag: 'New' },
]
export const customerOrderHistory = [
  { id: 'LS1024', date: 'Sep 23, 2024', amount: 750, status: 'Processing' },
  { id: 'LS1018', date: 'Sep 20, 2024', amount: 520, status: 'Delivered' },
  { id: 'LS1012', date: 'Sep 15, 2024', amount: 900, status: 'Delivered' },
  { id: 'LS1008', date: 'Sep 10, 2024', amount: 650, status: 'Cancelled' },
  { id: 'LS1001', date: 'Sep 02, 2024', amount: 480, status: 'Delivered' },
]

export const reviews: Review[] = [
  { id: '1', title: 'Very tasty and fresh!', body: 'Kaja was very fresh and delicious. Loved the taste and the packaging was also nice. Will definitely order again!', type: 'Product', product: 'Kaja', variant: '500 g', customer: 'Ravi Kumar', phone: '+91 98765 43210', rating: 5, date: 'Sep 22, 2024 10:32 AM', order: '#LS1024', reply: "Thank you so much, Ravi! We're glad you enjoyed the Kaja. Looking forward to serving you again! 😊" },
  { id: '2', title: 'Good quality and nice packaging.', body: 'Really liked the taste and the packaging was great.', type: 'Product', product: 'Ariselu', variant: '250 g', customer: 'Priya Sharma', phone: '+91 91234 56789', rating: 4, date: 'Sep 20, 2024 06:15 PM', order: '#LS1018' },
  { id: '3', title: 'Excellent service and experience!', body: 'Great quality sweets and very friendly service.', type: 'Business', product: 'Store Review', variant: '', customer: 'Arjun Reddy', phone: '+91 99887 66554', rating: 5, date: 'Sep 18, 2024 11:20 AM', order: '#LS1012' },
  { id: '4', title: 'Authentic taste!', body: 'Murukulu tasted just like homemade. Will definitely order again.', type: 'Product', product: 'Murukulu', variant: '250 g', customer: 'Meena Reddy', phone: '+91 88995 22334', rating: 4, date: 'Sep 16, 2024 02:45 PM', order: '#LS1008' },
  { id: '5', title: 'Best sweets in town!', body: 'Always fresh and tasty. Highly recommended!', type: 'Business', product: 'Store Review', variant: '', customer: 'Suresh Babu', phone: '+91 90123 45678', rating: 5, date: 'Sep 14, 2024 09:10 AM', order: '#LS1001' },
  { id: '6', title: 'Very good taste.', body: 'Chips are crispy and fresh. Could be a bit less salty.', type: 'Product', product: 'Ghaatu Mixture', variant: '200 g', customer: 'Vikram Naidu', phone: '+91 93456 77890', rating: 4, date: 'Sep 12, 2024 07:30 PM', order: '#LS0998' },
  { id: '7', title: 'Good quality and fast delivery.', body: 'Nice selection of traditional sweets. Packaging could improve.', type: 'Business', product: 'Store Review', variant: '', customer: 'Anusha Reddy', phone: '+91 99876 54321', rating: 4, date: 'Sep 10, 2024 05:15 PM', order: '#LS0995' },
  { id: '8', title: 'Tasted amazing!', body: 'Boondi Laddu was super delicious. My family loved it.', type: 'Product', product: 'Boondi Laddu', variant: '500 g', customer: 'Ramesh K', phone: '+91 91230 44556', rating: 5, date: 'Sep 08, 2024 01:12 PM', order: '#LS0988' },
]

export const salesSeries = [800,1500,2200,1800,2600,3100,2400,1900,2900,3500,4200,3600,4100,4800,5420,4300,3700,4200,4500,4600,5000,6200,6900,7400,6600,5800,5200,5900,6500,6100]
