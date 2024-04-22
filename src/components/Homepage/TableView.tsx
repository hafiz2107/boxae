import { Doc } from '../../../convex/_generated/dataModel';
import { columns } from '../FileTableView/Columns';
import { DataTable } from '../FileTableView/TableView';

const TableView = ({
  files,
}: {
  files: (Doc<'files'> & { url: string | null; isFavorited: boolean })[];
}) => {
  return (
    <div>
      <DataTable columns={columns} data={files} />
    </div>
  );
};

export default TableView;
