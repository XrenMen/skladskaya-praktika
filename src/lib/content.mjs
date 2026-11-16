import storage from '../../content/storage.mjs';
import operations from '../../content/operations.mjs';
import storageWork from '../../content/storage-work.mjs';
import warehouseWork from '../../content/warehouse-work.mjs';

import orderPicking from '../../content/order-picking.mjs';
import storageAddresses from '../../content/storage-addresses.mjs';

export default [...orderPicking, ...storageAddresses, ...warehouseWork, ...storageWork, ...storage, ...operations];