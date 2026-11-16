import storage from '../../content/storage.mjs';
import firstWarehouseInvoice from '../../content/first-warehouse-invoice.mjs';
import firstWarehouseMonth from '../../content/first-warehouse-month.mjs';
import warehouseReturnsCase from '../../content/warehouse-returns-case.mjs';
import operations from '../../content/operations.mjs';
import storageWork from '../../content/storage-work.mjs';
import warehouseWork from '../../content/warehouse-work.mjs';

import orderPicking from '../../content/order-picking.mjs';
import storageAddresses from '../../content/storage-addresses.mjs';

export default [...orderPicking, ...storageAddresses, ...warehouseWork, ...storageWork, ...storage, ...operations, ...firstWarehouseInvoice, ...firstWarehouseMonth, ...warehouseReturnsCase];