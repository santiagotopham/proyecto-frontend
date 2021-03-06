import React, { Component } from 'react';
import 'typeface-roboto';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

class CartPickers extends Component{
    
    state = {
        value: '1',
    };

    componentDidMount(){
        this.setState({value: this.props.envioType});
    }

    handleChange = (event) => {
        console.log('arreglar esto')
    }

    render(){

        let textProv = `Envio del proveedor ($${this.props.priceEnvio})`

        return(
            <FormControl component="fieldset">
            <RadioGroup
              aria-label="Envio"
              name="envioPicker"
              value={this.state.value}
              onChange={this.handleChange}
            >
                <FormControlLabel
                    value={'1'}
                    control={<Radio color='primary' />}
                    label='Lo voy a buscar (Sin costo)'
                />
                <FormControlLabel 
                    value={'2'}
                    control={<Radio color='primary' />}
                    label={textProv}
                />
            </RadioGroup>
          </FormControl>
        );
    }
}

export default CartPickers;