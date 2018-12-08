import React, {Component} from "react";
import "typeface-roboto";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from '@material-ui/core/CardMedia';
import CartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto'
    },
    table: {
      minWidth: 700,
    },
  });

class DetalleProducto extends Component{

    state = {
        producto: {},
        companyProduct:[],

    }

    async componentWillMount(){
        let productos = await this.props.getProductsCompanyByCompanies(this.props.productId);
        let producto = await this.props.getProductById(this.props.productId);
        console.log(producto);
        //concat
        await this.setState({
            companyProduct: productos,
            producto:producto
        })
        console.log(this.state);
    }

    agregarAlCarrito = (i) => {
        console.log('producto detalle', this.state.companyProduct[i]);
        this.props.agregarAlCarrito(this.state.companyProduct[i]);
    }

    render(){
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
            <div>
                <Typography variant='h4'>{this.state.producto.name}</Typography>
                <div>
                    <CardMedia
                        component='img'
                        height='10%'
                        width='20%'
                        className={classes.cover}
                        src={`${this.state.producto.imageUrl}`}
                        title={this.state.producto.name}
                    />
                </div>
            </div>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Codigo
                            </TableCell>
                            <TableCell>
                                Nombre
                            </TableCell>
                            <TableCell>
                                Precio
                            </TableCell>
                            <TableCell>
                                Descripcion
                            </TableCell>
                            <TableCell>
                                Stock
                            </TableCell>
                            <TableCell> productos = await this.props.getProductsCompanyByCompanies(this.props.productId);
                                Imagen
                            </TableCell>
                            <TableCell>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.companyProduct.map((product, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    {this.state.producto.code}
                                </TableCell>
                                <TableCell>
                                    {product.name}    
                                </TableCell>
                                <TableCell>
                                    {product.price}    
                                </TableCell>
                                <TableCell>
                                    {product.description}    
                                </TableCell>
                                <TableCell>
                                    {product.stock}    
                                </TableCell>
                                <TableCell /*component = 'img' src={product.imageUrl}*/>
                                      aca va la imagen pero no la puedo achicar.  
                                </TableCell>
                                <TableCell>
                                <Button size="small" color="primary" 
                                    onClick={()=>
                                            this.agregarAlCarrito(i)}>
                                    <CartIcon className={classes.leftIcon} />
                                    Agregar
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}
DetalleProducto.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DetalleProducto);