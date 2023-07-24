import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import notify from "../features/notify";
import { Button } from "@mui/material";
import SwitchBase from "@mui/material/internal/SwitchBase";

function createData(
  id,
  firstName,
  lastName,
  email,
  isAdmin,
  createdAt,
  updatedAt,
  actions
) {
  return {
    id,
    firstName,
    lastName,
    email,
    isAdmin,
    createdAt,
    updatedAt,
    actions,
  };
}
const rows = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "Id",
  },
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: "First name",
  },
  {
    id: "lastName",
    numeric: false,
    disablePadding: false,
    label: "Last name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "isAdmin",
    numeric: false,
    disablePadding: false,
    label: "Admin",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Created",
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: false,
    label: "Updated",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all users",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Users
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [users, setUsers] = React.useState();

  React.useEffect(() => {
    const getUsers = async () => {
      const sendRequest = await fetch("/api/users", { method: "GET" });
      // console.log(sendRequest);
      if (sendRequest.status === 200) {
        const usersJSON = await sendRequest.json();
        await usersJSON.map((user, key) => {
          rows[key] = createData(
            user.id,
            user.first_name,
            user.last_name,
            user.email,
            user.is_admin,
            user.created_at,
            user.updated_at,
            user.id
          );
        });
        console.log(usersJSON);
        console.log(rows);
        // setUsers(usersJSON);
        setUsers({ rows });
        console.log(users);
      } else {
        const error = await sendRequest.json();
        notify(error.error, "error");
      }
    };
    getUsers();
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    // console.log(name);
    const selectedIndex = selected.indexOf(name);
    // console.log(selectedIndex);
    let newSelected = [];
    //TODO verify and repare
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1; //TODO verify

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
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
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                const modifyDateFormat = (dateSQL) => {
                  return `${("0" + new Date(dateSQL).getDate()).slice(-2)}/${(
                    "0" +
                    (new Date(dateSQL).getMonth() + 1)
                  ).slice(-2)}/${new Date(dateSQL).getFullYear()}`;
                };
                const changeAdmin = () => {
                  console.log(row.isAdmin);
                  const selectedIndex = selected.indexOf(row.id);
                  console.log(selectedIndex);
                  const changeAdminStatus = async () => {
                    const sendRequest = await fetch(
                      `/api/users/${row.id}/change-admin-status`,
                      { method: "PUT" }
                    );
                    // console.log(sendRequest);
                    if (sendRequest.status === 200) {
                      const userJSON = await sendRequest.json();
                      // await usersJSON.map((user, key) => {
                      //   rows[key] = createData(
                      //     user.id,
                      //     user.first_name,
                      //     user.last_name,
                      //     user.email,
                      //     user.is_admin,
                      //     user.created_at,
                      //     user.updated_at,
                      //     user.id
                      //   );
                      // });
                      console.log(userJSON);
                      console.log(row.id);
                      let rowKey = rows.map((item) => item.id).indexOf(row.id);
                      console.log(rows.indexOf(row.id));
                      console.log(rowKey);
                      console.log(rows);
                      console.log(users);
                      let updatedUsers = { ...users };
                      console.log(updatedUsers);
                      // 2. Make a shallow copy of the item you want to mutate
                      let userTarget = { ...updatedUsers.rows[rowKey] };
                      console.log(userTarget);
                      // 3. Replace the property you're intested in
                      userTarget = createData(
                        userJSON.user.id,
                        userJSON.user.first_name,
                        userJSON.user.last_name,
                        userJSON.user.email,
                        userJSON.user.is_admin,
                        userJSON.user.created_at,
                        userJSON.user.updated_at,
                        userJSON.user.id
                      );
                      // 4. Put it back into our array. N.B. we *are* mutating the array here,
                      //    but that's why we made a copy first
                      updatedUsers.rows[rowKey] = userTarget;
                      // 5. Set the state to our new copy
                      setUsers(updatedUsers);
                      // console.log(rows);
                      // setUsers(usersJSON);
                      // setUsers({ ...users, rows });
                      console.log(users);
                    }
                  };
                  changeAdminStatus();
                };

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.firstName}</TableCell>
                    <TableCell align="right">{row.lastName}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">
                      {row.isAdmin}{" "}
                      <Switch
                        checked={row.isAdmin === 0 ? false : true}
                        onChange={() => {
                          changeAdmin();
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {modifyDateFormat(row.createdAt)}
                    </TableCell>
                    <TableCell align="right">
                      {modifyDateFormat(row.updatedAt)}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={(e) => {
                          console.log(row.id);
                        }}
                        color="success"
                        variant="contained"
                        size="small"
                      >
                        {row.actions} Edit{" "}
                      </Button>
                      <Button
                        onClick={(e) => {
                          console.log(row.id);
                        }}
                        color="error"
                        variant="contained"
                        size="small"
                      >
                        {row.actions} Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}