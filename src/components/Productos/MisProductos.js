import React, { Fragment } from 'react';
import 'typeface-roboto';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import AlertEliminar from './AlertEliminar';
import AlertRestaurar from './AlertRestaurar';
import Avatar from '@material-ui/core/Avatar';
import ModificarProducto from './ModificarProducto'
import ModificarPaquete from '../Paquetes/ModificarPaquete';
import AjustePrecioCategoria from './AjustePrecioCategoria';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import SelectMultiple from '../Helpers/SelectMultiple';
import BackIcon from '@material-ui/icons/ArrowBack';
import { Typography, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'code', numeric: false, disablePadding: true, label: 'Codigo' },
  { id: 'image', numeric: false, disablePadding: false, label: 'Imagen' },
  { id: 'name', numeric: true, disablePadding: false, label: 'Nombre' },
  { id: 'stock', numeric: true, disablePadding: false, label: 'Stock' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Precio' },
  { id: 'tipo', numeric: false, disablePadding: false, label: 'Tipo' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'acciones', numeric: false, disablePadding: false, label: 'Acciones' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Ordenar"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    marginTop: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit,
  },
  texto: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
  },
  acciones: {
    textAlign: 'left'
  }
});

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    productos: [],
    products: [],
    categories: [],
    page: 0,
    rowsPerPage: 10,
    searchName: '',
    selectedCategory: [],
    textoCarga: 'Cargando productos...',
    cargaTerminada: false,
    cantidad: 0,
    verDeleted: false,
  };

    async componentWillMount(){

      this.verificarLogin();

      let categories = await this.props.getCategories(this.props.getCategories);
      let paquetes = await this.props.getAllPackages(this.props.company);
      let productos = await this.props.getAllCompanyProducts(this.props.company);

      let listado = productos.concat(paquetes);
      let textoCarga = '', cargaTerminada = false;
      if(listado.length === 0){
        cargaTerminada = true;
        textoCarga = 'Aun no tiene productos registrados.';
      }
      
      this.setState({
          productos: listado,
          products: productos,
          categories,
          textoCarga,
          cargaTerminada,
          cantidad: listado.length
      }, () => this.encontrarCantidad());
    }

    verificarLogin = async () => {
      let tokenValido = await this.props.verificarToken();

      if(!tokenValido){
        this.props.enqueueSnackbar('No ha iniciado sesion.', { variant: 'error'});
        setTimeout(() => history.goBack(), 2000);
      }
    }

    encontrarCantidad = () => {
      let cantidad = this.state.productos.reduce((i, p) => {
        if(p.deleted && this.state.verDeleted) i++;
        else if(!p.deleted) i++;
        return i;
      }, 0);
      this.setState({cantidad});
    }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

    onSearchNameChange = (e) => {
        this.setState({
            searchName: e.target.value
        });
    };

    handleSelectCategories = (seleccionados) => {
        let selectedCategory = seleccionados.map(selected => {
            return selected.id;
        })
        this.setState({selectedCategory: selectedCategory});
    }

    handleDelete = async (id, esPackage) =>{
        let listado = [];
        if(esPackage) {
            let status = await this.props.eliminarPaquete(id);
            if(status === 200){
                listado = this.state.productos.filter(prod => {
                    if(!prod.esPackage) return prod;
                    else return prod.id !== id;
                });
                this.setState({productos: listado});
            }
        }
        else{
            let status = await this.props.eliminarProducto(id);
            if(status === 200){
                listado = this.state.productos.filter(prod => {
                    if(prod.esPackage) return prod;
                    else return prod.id !== id;
                });
                this.setState({productos: listado});
            }
        }
    }

    handleRestaurar = async (id, esPackage) =>{
      let listado = [];
      if(esPackage) {
          let status = await this.props.restaurarPaquete(id);
          if(status === 200){
              listado = this.state.productos.map(prod => {
                  if(!prod.esPackage) return prod;
                  else if(prod.id === id){
                    prod.deleted = null;
                    return prod
                  }
                  else return prod;
              });
              this.setState({productos: listado});
          }
      }
      else{
          let status = await this.props.restaurarProducto(id);
          if(status === 200){
              listado = this.state.productos.map(prod => {
                  if(prod.esPackage) return prod;
                  else if(prod.id === id){
                    prod.deleted = null;
                    return prod;
                  }
                  else return prod;
              });
              this.setState({productos: listado});
          }
      }
  }

    handleEdit = (product, pos) => {
        let listado = this.state.productos;
        listado[pos] = product;
        this.setState({ productos: listado });
    }

    handleCheckBoxChange = name => event => {
      this.setState({ [name]: event.target.checked, verDeleted: !this.state.verDeleted }, () => this.encontrarCantidad());
    };

    volverAtras = () => {
      history.goBack();
    }

  render() {
    const { classes } = this.props;
    const { productos, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, productos.length - page * rowsPerPage);

    let filteredList = [];
    if(this.state.productos.length !== 0){
      filteredList = this.state.productos.filter((item) => {
          return item.name.toLowerCase().indexOf(this.state.searchName.toLowerCase()) !== -1;
      });

      if(this.state.selectedCategory.length > 0){
          filteredList = filteredList.filter(item => {
              let res = false;
              let i = 0;
              let counter = 0;
              while(i<item.categories.length){
                  if(this.state.selectedCategory.includes(item.categories[i].id)){
                      counter++;
                  }
                  i++;
              }
              if(counter > 0) res = true;
              return res;
          });
      }
    }

    return (
        <Fragment>
            {filteredList.length === 0 ? (
              <div className={classes.texto}>
                <Typography variant='h6' className={classes.texto}>
                    {this.state.textoCarga}
                </Typography>
                {this.state.cargaTerminada ? (
                    <Button onClick={this.volverAtras} className={classes.texto}>
                        <BackIcon />
                        Volver
                    </Button>
                ) : <CircularProgress className={classes.progress} />}
              </div>
            ) : (
              <Fragment>
                    <div className={classes.container}>
                    <div>
                        <TextField
                            className={classes.textField}
                            name='searchName'
                            placeholder='Nombre del producto'
                            onChange={this.onSearchNameChange}
                        />
                        </div>
                        <div>
                        <SelectMultiple
                            flagType={this.props.flag}
                            flagForm={false}
                            content={this.state.categories}
                            onChange={this.handleSelectCategories}
                        />
                        </div>
                        <div>
                          <AjustePrecioCategoria categories={this.state.categories} ajustarPrecioCategoria={this.props.ajustarPrecioCategoria} />
                        </div>
                        <div>
                          <Typography variant='subheading' color='textSecondary'>
                          Ver descontinuados
                          <Checkbox
                            checked={this.state.checkedB}
                            onChange={this.handleCheckBoxChange(true)}
                            value="verDeleted"
                            color="primary"
                          />
                          </Typography>
                        </div>
                    </div>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={this.state.cantidad}
                        />
                        <TableBody>
                        {stableSort(filteredList, getSorting(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((n, indice) => {
                            const isSelected = this.isSelected(n.id);
                            return (
                              n.deleted && !this.state.verDeleted ? (
                                null
                              ) : (
                                <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isSelected}
                                tabIndex={-1}
                                key={n.id}
                                selected={isSelected}
                                >
                                <TableCell padding="checkbox">
                                </TableCell>
                                <TableCell component="th" scope="row" padding="none">
                                    {n.code}
                                </TableCell>
                                <TableCell>
                                  <Avatar alt={n.imageName} src={n.imageUrl} className={classes.avatar} />
                                </TableCell>
                                <TableCell align="right"><Typography variant='subtitle1'>{n.name}</Typography></TableCell>
                                <TableCell align="right"><Typography variant='subtitle1'>{n.stock}</Typography></TableCell>
                                <TableCell align="right"><Typography variant='subtitle1'>$ {n.price}</Typography></TableCell>
                                <TableCell align="right"><Typography variant='subtitle1'>{n.esPackage ? 'Paquete' : 'Producto'}</Typography></TableCell>
                                <TableCell align="right"><Typography variant='subtitle1'>{n.deleted ? 'Descontinuado' : 'Activo'}</Typography></TableCell>
                                <TableCell>
                                  <div className={classes.acciones}>
                                    {n.deleted ? (
                                      <AlertRestaurar productId={n.id} esPackage={n.esPackage} restaurar={this.handleRestaurar} />
                                    ) : (
                                      <Fragment>
                                        {!n.esPackage ?
                                        (
                                          <ModificarProducto
                                              product={n}
                                              categories={this.state.categories}
                                              modificar={this.props.modificarProducto}
                                              actualizarLista={this.handleEdit}
                                              posicion={indice}
                                          />
                                        )
                                        :
                                        (
                                        <ModificarPaquete
                                            products={this.state.products}
                                            categories={this.state.categories}
                                            modificarPaquete={this.props.modificarPaquete}
                                            actualizarLista={this.handleEdit}
                                            posicion={indice}
                                            package={n}
                                            enqueueSnackbar={this.props.enqueueSnackbar}
                                        /> 
                                        )}
                                        <AlertEliminar productId={n.id} esPackage={n.esPackage} eliminar={this.handleDelete} />
                                      </Fragment>
                                    )}
                                  </div>
                                </TableCell>
                                </TableRow>
                              )
                            );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                    </div>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={this.state.cantidad}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      backIconButtonProps={{
                          'aria-label': 'Previous Page',
                      }}
                      nextIconButtonProps={{
                          'aria-label': 'Next Page',
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                </Fragment>
            ) }
      </Fragment>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);