import storage from '../../content/storage.mjs';
import operations from '../../content/operations.mjs';
import storageWork from '../../content/storage-work.mjs';
import warehouseWork from '../../content/warehouse-work.mjs';

export default [...warehouseWork, ...storageWork, ...storage, ...operations];