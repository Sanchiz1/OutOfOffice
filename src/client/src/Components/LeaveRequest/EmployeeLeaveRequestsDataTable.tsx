import { Button, InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../Types/Employee';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { requestPositions } from '../../API/positionRequests';
import { LeaveRequest } from '../../Types/LeaveRequest';
import { GetDateString } from '../../Helpers/DateFormatHelper';
import { getEmployeeLeaveRequests } from '../../API/leaveRequestRequests';
import { RootState } from '../../Redux/store';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof LeaveRequest;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'absenceReason',
        numeric: false,
        disablePadding: false,
        label: 'Absence Reason',
    },
    {
        id: 'startDate',
        numeric: false,
        disablePadding: false,
        label: 'Start Date',
    },
    {
        id: 'endDate',
        numeric: false,
        disablePadding: false,
        label: 'End Date',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof LeaveRequest) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof LeaveRequest) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align='left'
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell
                    align='left'>
                    Action
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    handleSearch: (search: string) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, handleSearch } = props;

    const [search, setSearch] = React.useState<string>('');

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 }
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Leave requests
            </Typography>
        </Toolbar>
    );
}

interface EmployeeLeaveRequestsDataTableProps {
    employeeId: number
}

export default function EmployeeLeaveRequestsDataTable(props: EmployeeLeaveRequestsDataTableProps) {
    const { employeeId } = props;
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const [update, setUpdate] = React.useState<boolean>(false);

    const [rows, setRows] = React.useState<LeaveRequest[]>([]);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof LeaveRequest>('startDate');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState<string>('');

    React.useEffect(() => {
        if(!employeeId) return;
        getEmployeeLeaveRequests(employeeId, page * rowsPerPage, rowsPerPage, orderBy, order).subscribe({
            next(value) {
                setRows(value)
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        });
    }, [order, orderBy, page, rowsPerPage, update, employeeId])


    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof LeaveRequest,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = Math.max(0, rowsPerPage - rows.length);


    const handleSearch = (s: string) => {
        setSearch(s);

        page === 0 ? setUpdate(!update) : setPage(0);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} handleSearch={(e) => handleSearch(e)} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="normal"
                                        >
                                            {row.absenceReason}
                                        </TableCell>
                                        <TableCell align="left">{GetDateString(new Date(row.startDate))}</TableCell>
                                        <TableCell align="left">{GetDateString(new Date(row.endDate))}</TableCell>
                                        <TableCell align="left">{row.status}</TableCell>
                                        <TableCell align="left">
                                            <Button size='small' onClick={() => navigator("/leaveRequest/" + row.id)}>Visit</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 43.55 : 63.55) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    backIconButtonProps={{ disabled: page === 0 }}
                    nextIconButtonProps={{ disabled: emptyRows > 0 || rows.length < rowsPerPage }}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => ""}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}